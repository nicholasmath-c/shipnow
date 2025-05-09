interface TypoProps {
  title: string;
}

export function TypoH1({ title }: TypoProps) {
  return (
    <h1 className="scroll-m-20 text-xl font-semibold tracking-tight lg:text-xl mb-6">
      {title}
    </h1>
  );
}
