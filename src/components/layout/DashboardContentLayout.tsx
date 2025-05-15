interface DashboardContentLayoutProps {
  children: React.ReactNode;
}

export default function DashboardContentLayout({
  children,
}: DashboardContentLayoutProps) {
  return <div className="@container/main flex flex-1 flex-col gap-4 md:gap-8 md:p-8 p-4 max-w-dvw">{children}</div>;
}
