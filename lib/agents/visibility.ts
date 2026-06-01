export function shouldShowAgents(pathname: string) {
  // Only show agent UIs when the path is under the enterprise portal
  // e.g. /portal/enterprise/*
  try {
    if (!pathname) return false;
    return pathname.startsWith("/portal/enterprise");
  } catch {
    return false;
  }
}
