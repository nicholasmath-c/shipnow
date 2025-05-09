interface HeaderProps {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background px-4">
      {children}
    </header>
  );
}
