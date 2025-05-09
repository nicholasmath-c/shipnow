import { Button } from "@/components/ui/button";

export default function Error403() {
  return (
    <div className="items-center h-dvh text-center flex flex-col justify-center gap-8">
      <h1 className="font-bold text-2xl">Erro 403 - Sem autorização.</h1>
      <p>Você não possui acesso a esta página.</p>
      <Button><a href="/">Voltar a tela inicial</a></Button>
    </div>
  );
}
