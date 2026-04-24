export const INTERVIEW_TYPES = [
	"General Employment Interview",
	"Entry-Level Job Interview",
	"Customer Service Interview",
	"Warehouse / Labor Interview",
	"Food Service Interview",
	"Security Interview",
	"Office / Admin Interview",
	"Peer Support / Social Services Interview",
	"Reentry-Friendly Interview",
	"First Job Interview",
] as const;

export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export const INDUSTRY_PATHS = {
	entryLevel: [
		"Customer Service Interview",
		"Warehouse / Labor Interview",
		"Food Service Interview",
		"Security Interview",
		"General Employment Interview",
	],
	specialized: [
		"Office / Admin Interview",
		"Peer Support / Social Services Interview",
	],
	barrierSpecific: [
		"Reentry-Friendly Interview",
		"First Job Interview",
		"Entry-Level Job Interview",
	],
} as const;

export const INTERVIEWREADY_TAGLINE =
	"Build confidence, master your story, and bridge the gap to employment.";

export const INTERVIEW_COACH_SYSTEM_PROMPT = `You are a supportive Employment Coach. Your persona is professional, encouraging, and trauma-informed. Your goal is to help users, including people with high anxiety or employment barriers, feel capable and prepared.

Guidelines:
- Use simple, direct language.
- If an answer is weak, never call it bad; say: We can make this even stronger by adding...
- If the user mentions barriers like an employment gap, coach toward lessons learned and transferable skills.
- Keep a 3:1 ratio of positive reinforcement to constructive feedback.`;

export const FEEDBACK_GENERATION_PROMPT = `Analyze the interview transcript.
Identify the core strength shown.
Provide a professional polish rewrite in the user's voice with less slang/filler.
Rate job readiness from 1-5.
Give one specific tip for the next attempt.`;

export const DEFAULT_QUESTIONS = [
	"Tell me about yourself.",
	"Why are you interested in this position?",
	"What are your strengths?",
	"Tell me about a time you handled conflict.",
	"How do you handle stress at work?",
	"Why should we hire you?",
	"Do you have reliable transportation?",
	"Can you explain a gap in employment?",
	"What does good attendance mean to you?",
	"Do you have any questions for us?",
];

export type FeedbackScore = {
	clarity: number;
	professionalism: number;
	jobRelevance: number;
	growthMindset: number;
	confidence?: number;
	completeness?: number;
};

export type StarAnswer = {
	situation: string;
	task: string;
	action: string;
	result: string;
};

export type InterviewFeedback = {
	score: FeedbackScore;
	superpowers: string;
	polishFactor: string[];
	improvedAnswer: string;
	proRewriteBefore: string;
	proRewriteAfter: string;
	coreStrength: string;
	jobReadiness: number;
	wentWell: string;
	improve: string;
	encouragement: string;
	recommendation: string;
};

export type VoiceCoaching = {
	pacing: "slow" | "balanced" | "fast";
	fillerWords: number;
	confidenceTone: "needs-support" | "steady" | "strong";
	tips: string[];
};

export type InterviewAttemptRecord = {
	id: string;
	sessionId?: string;
	tenantId?: string;
	clientId: string;
	clientName: string;
	tentUID: string;
	caseManager: string;
	industryPath?: string;
	interviewType: InterviewType;
	jobType: InterviewType;
	questionAsked: string;
	transcriptJson?: string;
	clientAnswer: string;
	aiImprovedAnswer: string;
	clarityScore: number;
	professionalismScore: number;
	jobRelevanceScore: number;
	growthMindsetScore: number;
	confidenceScore?: number;
	completenessScore?: number;
	averageReadinessScore?: number;
	barrierFlag?: boolean;
	cmReviewed?: boolean;
	exportPdfUrl?: string;
	virtualHighFive?: boolean;
	cmComment?: string;
	feedbackSummary: string;
	createdDate: string;
	submittedToCaseManager: boolean;
	caseManagerNotes: string;
	followUpNeeded: boolean;
};

const clamp = (value: number, min = 1, max = 5) =>
	Math.max(min, Math.min(max, value));

const sentenceCount = (text: string) =>
	text
		.split(/[.!?]+/)
		.map((part) => part.trim())
		.filter(Boolean).length;

const wordCount = (text: string) =>
	text
		.trim()
		.split(/\s+/)
		.filter(Boolean).length;

const hasWorkContext = (text: string) =>
	/(work|job|team|customer|shift|supervisor|schedule|attendance|task|project)/i.test(
		text
	);

const hasOutcome = (text: string) =>
	/(result|improved|completed|resolved|learned|success|positive|outcome)/i.test(text);

const hasOwnership = (text: string) => /(I|my|me)\b/.test(text);

const hasGrowthLanguage = (text: string) =>
	/(learn|improve|practice|progress|growth|adapt|develop|better|ready)/i.test(text);

const hasBarrierSignal = (question: string, answer: string) => {
	if (!/(gap|reentry|justice|attendance|transportation|stress|conflict)/i.test(question)) {
		return false;
	}
	return /(i don't know|not sure|hard|struggle|can't|nervous|anxious|problem)/i.test(answer);
};

const PATH_QUESTIONS: Record<InterviewType, string[]> = {
	"General Employment Interview": [
		"Tell me about yourself.",
		"Why are you interested in this position?",
		"What strengths would you bring to our team?",
		"Describe a time you solved a problem at work or in daily life.",
		"How do you handle stress in a busy environment?",
		"What does reliable attendance mean to you?",
		"Why should we hire you?",
	],
	"Entry-Level Job Interview": [
		"Tell me about yourself.",
		"Why do you want an entry-level role right now?",
		"What are you most proud of learning recently?",
		"Describe a time you followed instructions carefully.",
		"How do you stay motivated during repetitive tasks?",
		"How would a supervisor describe your work ethic?",
		"Do you have any questions for us?",
	],
	"Customer Service Interview": [
		"Tell me about a time you helped someone who was frustrated.",
		"How do you stay calm with upset customers?",
		"What does great customer service look like to you?",
		"Describe a time you solved a problem quickly.",
		"How do you communicate with teammates during busy shifts?",
		"Why do you want to work in customer service?",
		"Do you have reliable transportation to get to shifts?",
	],
	"Warehouse / Labor Interview": [
		"What interests you about warehouse or labor work?",
		"How do you stay safe while working with physical tasks?",
		"Describe a time you worked hard to meet a deadline.",
		"How do you keep track of details in fast-paced work?",
		"Tell me about your attendance and punctuality.",
		"How do you handle repetitive work while staying focused?",
		"Why should we hire you for this role?",
	],
	"Food Service Interview": [
		"What interests you about food service work?",
		"How do you keep a positive attitude during a rush?",
		"Describe a time you handled multiple tasks at once.",
		"How do you make sure food safety and cleanliness are followed?",
		"How would you respond to a customer complaint?",
		"What does teamwork look like in a kitchen or front counter?",
		"Do you have scheduling flexibility for shifts?",
	],
	"Security Interview": [
		"Why do you want to work in security?",
		"Describe a time you stayed calm in a tense situation.",
		"How do you balance safety and respectful communication?",
		"How do you handle conflict while keeping control?",
		"What does professionalism mean in a security role?",
		"How do you stay observant during long shifts?",
		"Why should we trust you with this responsibility?",
	],
	"Office / Admin Interview": [
		"What interests you about office or admin work?",
		"How do you stay organized with multiple tasks?",
		"Describe a time you communicated clearly in writing.",
		"How do you prioritize when everything feels urgent?",
		"Tell me about your experience with schedules, files, or data entry.",
		"How do you handle confidentiality and professional boundaries?",
		"What value would you bring to this office team?",
	],
	"Peer Support / Social Services Interview": [
		"Why are you interested in peer support or social services?",
		"How do you support someone while respecting boundaries?",
		"Describe a time you listened without judgment.",
		"How do you handle emotionally difficult conversations?",
		"What does trauma-informed support mean to you?",
		"How do you practice self-care while helping others?",
		"Why should we hire you for this mission-driven role?",
	],
	"Reentry-Friendly Interview": [
		"Tell me about your goals as you re-enter the workforce.",
		"How have you prepared for work readiness?",
		"Can you explain your employment gap and what you learned during that time?",
		"What transferable skills can you bring from life experience?",
		"How do you stay accountable to attendance and schedules?",
		"Who is in your support network as you return to work?",
		"Why are you ready for this opportunity now?",
	],
	"First Job Interview": [
		"Tell me about yourself and why you want your first job.",
		"What skills have you built in school, volunteering, or home responsibilities?",
		"Describe a time you were dependable for others.",
		"How do you handle feedback from adults or supervisors?",
		"How will you balance schedule, transportation, and attendance?",
		"What does being professional mean to you?",
		"Why should we hire you for your first role?",
	],
};

export function getInterviewQuestionsByPath(jobType: InterviewType): string[] {
	return PATH_QUESTIONS[jobType] ?? DEFAULT_QUESTIONS;
}

export function buildMockInterviewQuestionSet(jobType: InterviewType, count = 6): string[] {
	const base = getInterviewQuestionsByPath(jobType);
	return base.slice(0, Math.max(5, Math.min(8, count)));
}

export function buildAdaptiveFollowUp(question: string, answer: string, jobType: InterviewType) {
	const fallback = "Can you share one specific example that shows this strength in action?";
	if (!answer.trim()) return fallback;

	if (/(gap|reentry|justice)/i.test(question)) {
		return "Thank you for sharing that. What lesson or transferable skill did you gain that will help you succeed at work now?";
	}

	if (/(stress|conflict|frustrated|complaint)/i.test(question)) {
		return "What was one step you took to stay calm and professional in that moment?";
	}

	if (/(attendance|transportation|schedule)/i.test(question)) {
		return "What is your plan to stay reliable with transportation and attendance each week?";
	}

	if (/(first job|entry-level)/i.test(jobType)) {
		return "If hired, what is one habit you will use to learn quickly in your first 30 days?";
	}

	return fallback;
}

export function analyzeVoiceAndTone(answer: string): VoiceCoaching {
	const wc = wordCount(answer);
	const fillerWords = (answer.match(/\b(um|uh|like)\b/gi) ?? []).length;
	const pacing = wc > 90 ? "fast" : wc < 25 ? "slow" : "balanced";
	const confidenceTone = wc < 20 || fillerWords > 5 ? "needs-support" : wc > 45 ? "strong" : "steady";

	const tips: string[] = [];
	if (pacing === "fast") tips.push("Try slowing down slightly to make your message easier to follow.");
	if (pacing === "slow") tips.push("Add one more concrete work example so your answer feels complete.");
	if (fillerWords > 2) tips.push("Pause between ideas instead of using filler words.");
	if (confidenceTone === "needs-support") tips.push("End with a confident closing sentence tied to the role.");
	if (!tips.length) tips.push("Strong tone. Keep this pacing and add one closing impact statement.");

	return { pacing, fillerWords, confidenceTone, tips };
}

export function buildProfessionalAnswer(
	answer: string,
	star: StarAnswer,
	question: string,
	jobType: InterviewType
) {
	const cleaned = answer.trim();
	const parts: string[] = [];

	if (star.situation.trim()) {
		parts.push(`In one role, ${star.situation.trim()}`);
	}
	if (star.task.trim()) {
		parts.push(`My responsibility was to ${star.task.trim()}`);
	}
	if (star.action.trim()) {
		parts.push(`I took action by ${star.action.trim()}`);
	}
	if (star.result.trim()) {
		parts.push(`As a result, ${star.result.trim()}`);
	}

	if (parts.length >= 2) {
		return `${parts.join(". ")}. This experience prepared me well for ${jobType.toLowerCase()} expectations.`;
	}

	if (!cleaned) {
		return `I am developing my answer to "${question}" and can provide a clear example from past responsibilities, the actions I took, and the result.`;
	}

	return `${cleaned} I stay focused on reliability, clear communication, and learning quickly so I can contribute in a professional workplace.`;
}

export function generateInterviewFeedback(
	answer: string,
	question: string,
	jobType: InterviewType,
	star: StarAnswer
): InterviewFeedback {
	const normalized = answer.trim();
	const wc = wordCount(normalized);
	const sc = sentenceCount(normalized);
	const starParts = Object.values(star).filter((part) => part.trim().length > 0).length;

	const clarity = clamp(Math.round((sc >= 2 ? 3.5 : 2.6) + (wc > 45 ? 0.8 : 0.1)));
	const professionalism = clamp(
		Math.round((/(please|thank|professional|responsible|punctual|respect)/i.test(normalized) ? 3.5 : 2.8) + (sc >= 2 ? 0.7 : 0.1))
	);
	const jobRelevance = clamp(
		Math.round((hasWorkContext(normalized) ? 3.6 : 2.5) + (jobType ? 0.5 : 0))
	);
	const growthMindset = clamp(
		Math.round((hasGrowthLanguage(normalized) ? 3.6 : 2.7) + (starParts >= 2 ? 0.6 : 0.1))
	);
	const confidence = clamp(Math.round((hasOwnership(normalized) ? 3.2 : 2.7) + (wc > 35 ? 0.8 : 0.2)));
	const completeness = clamp(Math.round((wc > 55 ? 3.5 : 2.6) + (hasOutcome(normalized) ? 0.8 : 0.2) + (starParts >= 3 ? 0.6 : 0.1)));

	const improvedAnswer = buildProfessionalAnswer(normalized, star, question, jobType);
	const readiness = Number((((clarity + professionalism + jobRelevance + growthMindset) / 4)).toFixed(1));

	const wentWell =
		wc > 30
			? "You shared a meaningful response and showed motivation. Your answer has a good foundation to build on."
			: "You gave a clear starting response. That is a strong first step in interview practice.";

	const improve =
		starParts < 3
			? "Add more specific details using STAR: what happened, what you had to do, what action you took, and the result."
			: "Strengthen your close by connecting your example directly to the role and what value you bring.";

	const superpowers =
		"Your Superpowers: You show motivation, accountability, and a clear desire to grow. Employers value that mindset.";

	const polishFactor = [
		"Add one concrete work or life example with a clear result.",
		"Use one short closing line that connects your strengths to the job.",
		"Practice a calm pace with fewer filler words for stronger delivery.",
	];

	const coreStrength =
		hasWorkContext(normalized) || hasOutcome(normalized)
			? "Responsibility under pressure"
			: "Growth-focused mindset";

	return {
		score: {
			clarity,
			professionalism,
			jobRelevance,
			growthMindset,
			confidence,
			completeness,
		},
		superpowers,
		polishFactor,
		wentWell,
		improve,
		improvedAnswer,
		proRewriteBefore: normalized || "(No answer entered yet)",
		proRewriteAfter: improvedAnswer,
		coreStrength,
		jobReadiness: readiness,
		encouragement:
			"You are making progress. Consistent practice and specific examples will keep building your confidence.",
		recommendation:
			"Practice this answer out loud two times. On the second try, keep eye contact and end with one sentence about how you can help the employer.",
	};
}

export function detectBarrierFlag(question: string, answer: string) {
	return hasBarrierSignal(question, answer);
}

export function averageScore(records: InterviewAttemptRecord[], key: keyof FeedbackScore) {
	if (!records.length) return 0;
	const map: Record<keyof FeedbackScore, keyof InterviewAttemptRecord> = {
		clarity: "clarityScore",
		professionalism: "professionalismScore",
		jobRelevance: "jobRelevanceScore",
		growthMindset: "growthMindsetScore",
		confidence: "confidenceScore",
		completeness: "completenessScore",
	};
	const recordKey = map[key];
	const total = records.reduce((sum, item) => sum + Number(item[recordKey] ?? 0), 0);
	return Number((total / records.length).toFixed(2));
}
