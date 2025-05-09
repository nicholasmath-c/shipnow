interface DashboardContentLayoutProps {
  children: React.ReactNode;
}

export default function DashboardContentLayout({
  children,
}: DashboardContentLayoutProps) {
  return <div className="md:p-8 p-4 max-w-dvw">{children}</div>;
}
