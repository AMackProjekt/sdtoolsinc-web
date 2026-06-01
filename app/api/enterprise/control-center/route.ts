import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/authz";
import { enforce } from "@/lib/policy";
import { getEncryptedRecord, setEncryptedRecord } from "@/lib/server-data-store";
import { decryptJson, encryptJson } from "@/lib/crypto";
import { ORG } from "@/config/org";
import { ensureTrustedOrigin } from "@/lib/request-security";
import {
	defaultEnterpriseSettings,
	enterpriseSettingsSchema,
	mergeEnterpriseSettings,
	type EnterpriseSettings,
} from "@/lib/enterprise-settings";

const SETTINGS_NAMESPACE = "enterprise-control";
const SETTINGS_KEY = "settings";

type ControlCenterSummary = {
	compliance: {
		overall: "approved" | "pending" | "not-configured";
		checks: {
			phi_workflow_approved: boolean;
			baa_confirmed: boolean;
			encryption_key_configured: boolean;
			auth_secret_configured: boolean;
			google_oauth_configured: boolean;
			kv_store_configured: boolean;
		};
	};
	security: {
		data_encrypted: boolean;
		auth_configured: boolean;
		secure_transport: boolean;
		session_strategy: string;
	};
	integrations: {
		resend: boolean;
		googleOAuth: boolean;
		googleChatWebhook: boolean;
		convex: boolean;
		blob: boolean;
		googleWorkspace: boolean;
		microsoft365: boolean;
		adobeAcrobat: boolean;
		connectors: Array<{
			id: string;
			label: string;
			category: "workspace" | "document" | "communication" | "crm" | "service" | "housing" | "finance";
			description: string;
			configured: boolean;
			requiredEnv: string[];
		}>;
	};
	identityAccess: {
		workspaceDomain: string;
		workspaceDomainConfigured: boolean;
		adminAllowlistCount: number;
		staffAllowlistCount: number;
		clientAllowlistCount: number;
		hasTwoFactorSecret: boolean;
		enforce2fa: boolean;
		sessionTimeoutHours: EnterpriseSettings["session_timeout_hours"];
	};
	organization: {
		name: string;
		shortName: string;
		productName: string;
		domain: string;
		programType: string;
		supportEmail: string;
		fromEmail: string;
		hmisConfigured: boolean;
		googleSiteConfigured: boolean;
		portalTheme: EnterpriseSettings["portal_theme"];
		recordsPerPage: EnterpriseSettings["records_per_page"];
		showOnboarding: boolean;
		dataRetentionDays: EnterpriseSettings["data_retention_days"];
	};
	platformOperations: {
		canReseedStaff: boolean;
		canReseedCaseload: boolean;
		canExportCaseload: boolean;
		canTestEmail: boolean;
		hasSetupToken: boolean;
	};
	settings: EnterpriseSettings;
	environment: {
		nodeEnv: string;
		hasSetupToken: boolean;
	};
};

function parseList(value: string | undefined): string[] {
	return (value ?? "")
		.split(",")
		.map((entry) => entry.trim().toLowerCase())
		.filter(Boolean);
}

function hasGoogleOauthCredentials(): boolean {
	const googleClientId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID;
	const googleClientSecret = process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;
	return Boolean(googleClientId) && Boolean(googleClientSecret);
}

function hasGoogleWorkspaceCredentials(): boolean {
	return Boolean(process.env.GOOGLE_WORKSPACE_CLIENT_EMAIL) &&
		Boolean(process.env.GOOGLE_WORKSPACE_PRIVATE_KEY) &&
		Boolean(process.env.GOOGLE_WORKSPACE_DELEGATED_ADMIN);
}

function hasMicrosoft365Credentials(): boolean {
	return Boolean(process.env.MS_GRAPH_TENANT_ID) &&
		Boolean(process.env.MS_GRAPH_CLIENT_ID) &&
		Boolean(process.env.MS_GRAPH_CLIENT_SECRET);
}

function hasAdobeAcrobatCredentials(): boolean {
	return Boolean(process.env.ADOBE_PDF_SERVICES_CLIENT_ID) &&
		Boolean(process.env.ADOBE_PDF_SERVICES_CLIENT_SECRET);
}

function hasRequiredEnv(requiredEnv: string[]): boolean {
	return requiredEnv.every((key) => Boolean(process.env[key]));
}

function getComplianceSummary(settings: EnterpriseSettings): ControlCenterSummary["compliance"] {
	const checks = {
		phi_workflow_approved:
			settings.phi_workflow_approved || process.env.PHI_WORKFLOW_APPROVED === "true",
		baa_confirmed: settings.baa_confirmed || process.env.BAA_CONFIRMED === "true",
		encryption_key_configured: Boolean(process.env.DATA_ENCRYPTION_KEY),
		auth_secret_configured: Boolean(process.env.AUTH_SECRET),
		google_oauth_configured: hasGoogleOauthCredentials(),
		kv_store_configured:
			Boolean(process.env.KV_REST_API_URL) && Boolean(process.env.KV_REST_API_TOKEN),
	};

	const criticalPass =
		checks.phi_workflow_approved &&
		checks.baa_confirmed &&
		checks.encryption_key_configured &&
		checks.auth_secret_configured &&
		checks.google_oauth_configured;

	const overall: ControlCenterSummary["compliance"]["overall"] = criticalPass
		? "approved"
		: Object.values(checks).some(Boolean)
			? "pending"
			: "not-configured";

	return { overall, checks };
}

function getSecuritySummary(): ControlCenterSummary["security"] {
	return {
		data_encrypted: Boolean(process.env.DATA_ENCRYPTION_KEY || process.env.AUTH_SECRET),
		auth_configured: Boolean(process.env.AUTH_SECRET) && hasGoogleOauthCredentials(),
		secure_transport:
			process.env.NODE_ENV === "production" ||
			Boolean(process.env.NEXTAUTH_URL?.startsWith("https://")),
		session_strategy: "jwt",
	};
}

function getIntegrationSummary(): ControlCenterSummary["integrations"] {
	const connectors: ControlCenterSummary["integrations"]["connectors"] = [
		{
			id: "google-workspace",
			label: "Google Workspace",
			category: "workspace",
			description: "Admin SDK telemetry, directory sync, and enterprise workspace controls.",
			configured: hasGoogleWorkspaceCredentials(),
			requiredEnv: [
				"GOOGLE_WORKSPACE_CLIENT_EMAIL",
				"GOOGLE_WORKSPACE_PRIVATE_KEY",
				"GOOGLE_WORKSPACE_DELEGATED_ADMIN",
			],
		},
		{
			id: "microsoft-365",
			label: "Microsoft 365",
			category: "workspace",
			description: "Microsoft Graph directory, identity, and tenant-level operational telemetry.",
			configured: hasMicrosoft365Credentials(),
			requiredEnv: ["MS_GRAPH_TENANT_ID", "MS_GRAPH_CLIENT_ID", "MS_GRAPH_CLIENT_SECRET"],
		},
		{
			id: "adobe-acrobat",
			label: "Adobe Acrobat",
			category: "document",
			description: "PDF generation, conversion, and document workflow automation.",
			configured: hasAdobeAcrobatCredentials(),
			requiredEnv: ["ADOBE_PDF_SERVICES_CLIENT_ID", "ADOBE_PDF_SERVICES_CLIENT_SECRET"],
		},
		{
			id: "docusign",
			label: "DocuSign eSignature",
			category: "document",
			description: "Contract and consent signature workflows for enterprise approvals.",
			configured: hasRequiredEnv([
				"DOCUSIGN_INTEGRATION_KEY",
				"DOCUSIGN_ACCOUNT_ID",
				"DOCUSIGN_USER_ID",
				"DOCUSIGN_PRIVATE_KEY",
			]),
			requiredEnv: [
				"DOCUSIGN_INTEGRATION_KEY",
				"DOCUSIGN_ACCOUNT_ID",
				"DOCUSIGN_USER_ID",
				"DOCUSIGN_PRIVATE_KEY",
			],
		},
		{
			id: "slack",
			label: "Slack",
			category: "communication",
			description: "Incident and operational notification routing across enterprise channels.",
			configured: hasRequiredEnv(["SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET"]),
			requiredEnv: ["SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET"],
		},
		{
			id: "salesforce",
			label: "Salesforce",
			category: "crm",
			description: "Account, case, and lifecycle synchronization into enterprise workflows.",
			configured: hasRequiredEnv([
				"SALESFORCE_CLIENT_ID",
				"SALESFORCE_CLIENT_SECRET",
				"SALESFORCE_LOGIN_URL",
			]),
			requiredEnv: ["SALESFORCE_CLIENT_ID", "SALESFORCE_CLIENT_SECRET", "SALESFORCE_LOGIN_URL"],
		},
		{
			id: "jira-service-management",
			label: "Jira Service Management",
			category: "service",
			description: "Ticket orchestration for cross-functional operations and change controls.",
			configured: hasRequiredEnv(["JIRA_BASE_URL", "JIRA_EMAIL", "JIRA_API_TOKEN"]),
			requiredEnv: ["JIRA_BASE_URL", "JIRA_EMAIL", "JIRA_API_TOKEN"],
		},
		{
			id: "csip",
			label: "CSIP",
			category: "housing",
			description: "Coordinated housing data exchange for client services and regional program reporting.",
			configured: hasRequiredEnv(["CSIP_API_BASE_URL", "CSIP_API_KEY"]),
			requiredEnv: ["CSIP_API_BASE_URL", "CSIP_API_KEY"],
		},
		{
			id: "sdhc",
			label: "San Diego Housing Commission (SDHC)",
			category: "housing",
			description: "Voucher, placement, and program data integration with SDHC workflows.",
			configured: hasRequiredEnv(["SDHC_API_BASE_URL", "SDHC_API_KEY"]),
			requiredEnv: ["SDHC_API_BASE_URL", "SDHC_API_KEY"],
		},
		{
			id: "rtfh",
			label: "RTFH",
			category: "housing",
			description: "Regional task force coordination, shared outcomes, and partner referral synchronization.",
			configured: hasRequiredEnv(["RTFH_API_BASE_URL", "RTFH_API_KEY"]),
			requiredEnv: ["RTFH_API_BASE_URL", "RTFH_API_KEY"],
		},
		{
			id: "quickbooks-online",
			label: "QuickBooks Online",
			category: "finance",
			description: "Program-level finance reporting, reconciliations, and accounting exports.",
			configured: hasRequiredEnv(["QBO_CLIENT_ID", "QBO_CLIENT_SECRET", "QBO_REALM_ID"]),
			requiredEnv: ["QBO_CLIENT_ID", "QBO_CLIENT_SECRET", "QBO_REALM_ID"],
		},
		{
			id: "netsuite",
			label: "Oracle NetSuite",
			category: "finance",
			description: "Enterprise finance and procurement synchronization for multi-department operations.",
			configured: hasRequiredEnv([
				"NETSUITE_ACCOUNT_ID",
				"NETSUITE_CONSUMER_KEY",
				"NETSUITE_CONSUMER_SECRET",
			]),
			requiredEnv: ["NETSUITE_ACCOUNT_ID", "NETSUITE_CONSUMER_KEY", "NETSUITE_CONSUMER_SECRET"],
		},
	];

	return {
		resend: Boolean(process.env.RESEND_API_KEY),
		googleOAuth: hasGoogleOauthCredentials(),
		googleChatWebhook: Boolean(process.env.Champions_Web_Hook),
		convex: Boolean(process.env.NEXT_PUBLIC_CONVEX_URL),
		blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
		googleWorkspace: hasGoogleWorkspaceCredentials(),
		microsoft365: hasMicrosoft365Credentials(),
		adobeAcrobat: hasAdobeAcrobatCredentials(),
		connectors,
	};
}

function getIdentityAccessSummary(settings: EnterpriseSettings): ControlCenterSummary["identityAccess"] {
	const adminAllowlist = parseList(process.env.ADMIN_ALLOWLIST);
	const staffAllowlist = parseList(process.env.STAFF_ALLOWLIST);
	const clientAllowlist = parseList(process.env.CLIENT_ALLOWLIST);

	return {
		workspaceDomain: ORG.domain,
		workspaceDomainConfigured: ORG.domain !== "sdtoolsinc.org",
		adminAllowlistCount: adminAllowlist.length,
		staffAllowlistCount: staffAllowlist.length,
		clientAllowlistCount: clientAllowlist.length,
		hasTwoFactorSecret: Boolean(process.env.TWO_FA_SECRET),
		enforce2fa: settings.enforce_2fa,
		sessionTimeoutHours: settings.session_timeout_hours,
	};
}

function getOrganizationSummary(settings: EnterpriseSettings): ControlCenterSummary["organization"] {
	return {
		name: ORG.name,
		shortName: ORG.shortName,
		productName: ORG.productName,
		domain: ORG.domain,
		programType: ORG.programType,
		supportEmail: ORG.supportEmail,
		fromEmail: ORG.fromEmail,
		hmisConfigured: Boolean(process.env.HMIS_SYSTEM_URL),
		googleSiteConfigured: Boolean(process.env.GOOGLE_SITE_URL),
		portalTheme: settings.portal_theme,
		recordsPerPage: settings.records_per_page,
		showOnboarding: settings.show_onboarding,
		dataRetentionDays: settings.data_retention_days,
	};
}

function getPlatformOperationsSummary(): ControlCenterSummary["platformOperations"] {
	const hasConvex = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
	return {
		canReseedStaff: hasConvex,
		canReseedCaseload: hasConvex,
		canExportCaseload: hasConvex,
		canTestEmail: Boolean(process.env.RESEND_API_KEY),
		hasSetupToken: Boolean(process.env.SETUP_TOKEN),
	};
}

async function readStoredSettings(): Promise<EnterpriseSettings> {
	const encrypted = await getEncryptedRecord(SETTINGS_NAMESPACE, SETTINGS_KEY);
	if (!encrypted) return defaultEnterpriseSettings;

	try {
		const decoded = decryptJson<unknown>(encrypted);
		return mergeEnterpriseSettings(decoded);
	} catch {
		return defaultEnterpriseSettings;
	}
}

export async function GET() {
	const auth = await getAuthContext();
	if (!auth.isAuthenticated || !auth.email) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const permission = enforce(auth.coreRole, "enterprise-control", "read");
	if (!permission.allowed) {
		return NextResponse.json({ error: permission.error }, { status: permission.status });
	}

	const settings = await readStoredSettings();
	const payload: ControlCenterSummary = {
		compliance: getComplianceSummary(settings),
		security: getSecuritySummary(),
		integrations: getIntegrationSummary(),
		identityAccess: getIdentityAccessSummary(settings),
		organization: getOrganizationSummary(settings),
		platformOperations: getPlatformOperationsSummary(),
		settings,
		environment: {
			nodeEnv: process.env.NODE_ENV ?? "development",
			hasSetupToken: Boolean(process.env.SETUP_TOKEN),
		},
	};

	return NextResponse.json(payload);
}

export async function PUT(req: NextRequest) {
	const originError = ensureTrustedOrigin(req);
	if (originError) return originError;

	const auth = await getAuthContext();
	if (!auth.isAuthenticated || !auth.email) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const permission = enforce(auth.coreRole, "enterprise-control", "write");
	if (!permission.allowed) {
		return NextResponse.json({ error: permission.error }, { status: permission.status });
	}

	const rawBody = await req.json();
	const parsed = enterpriseSettingsSchema.safeParse(rawBody);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
	}

	const encrypted = encryptJson(parsed.data);
	await setEncryptedRecord(SETTINGS_NAMESPACE, SETTINGS_KEY, encrypted);

	return NextResponse.json({ ok: true, settings: parsed.data });
}
