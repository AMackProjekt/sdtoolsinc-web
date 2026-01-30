// Force dynamic rendering for all auth routes
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
