/**
 * Auth Layout - Wraps all auth routes (login, register, forgot-password, reset-password)
 * Uses root layout styling - no additional wrapper needed
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
