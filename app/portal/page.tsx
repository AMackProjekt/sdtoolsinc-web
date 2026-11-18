import { redirect } from "next/navigation";

/** Single canonical entrypoint for the protected portal area. */
export default function PortalEntryPage() {
  redirect("/portal/portals");
}
