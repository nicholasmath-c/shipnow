import React from "react";

export default function ContainerVerticalCenter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-muted flex-col min-h-svh items-center justify-center">
      {children}
    </div>
  );
}
