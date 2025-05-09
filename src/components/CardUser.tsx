import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { iUser } from "@/data/@types/user";
import { User } from "lucide-react";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { useState } from "react";
import { changePassword } from "@/data/services/userService";
import { toast } from "sonner";

interface CardUserProps {
  user: iUser | undefined;
}

const formSchema = z
  .object({
    senha_antiga: z
      .string({ required_error: "Informe sua senha antiga." })
      .min(8, "A senha precisa conter no mínimo 8 caracteres"),
    nova_senha: z
      .string({ required_error: "Informe sua nova senha." })
      .min(8, "A senha precisa conter no mínimo 8 caracteres"),
    repetir_nova_senha: z
      .string({ required_error: "Repita sua nova senha." })
      .min(8, "A senha precisa conter no mínimo 8 caracteres"),
  })
  .refine((data) => data.nova_senha === data.repetir_nova_senha, {
    message: "As senhas não coincidem",
    path: ["repetir_nova_senha"],
  });

export default function CardUser({ user }: CardUserProps) {
  const [isLoading, setIsLoading] = useState(false);

  const nivelAcesso =
    user?.nivel_acesso === "user"
      ? "Usuário comum"
      : user?.nivel_acesso === "tech"
      ? "Técnico"
      : "Administrador";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setIsLoading(true);
    try {
      const userObj = {
        nome: user?.nome,
        login: user?.login,
        senha: user?.senha,
        nivel_acesso: user?.nivel_acesso,
        matricula: user?.matricula,
        celular: user?.celular ?? null,
        email: user?.email ?? null,
        id_setor: user?.id_setor,
        id_cargo: user?.id_cargo,
      };

      const response = await changePassword(
        user?.id,
        userObj,
        values.senha_antiga,
        values.nova_senha
      );

      if (response.status === 200) {
        toast.success("Senha alterada com sucesso!");
        form.reset({
          senha_antiga: "",
          nova_senha: "",
          repetir_nova_senha: ""
        });
      }
    } catch (error) {
      form.setError("senha_antiga", {
        type: "manual",
        message: "Senha antiga incorreta.",
      });
    } finally {
      setIsLoading(false); // Garante que o loading sempre pare
    }
  }

  return (
    <Card className="w-full md:w-150 p-10">
      <CardHeader>
        <div className="flex flex-col gap-4 justify-center items-center">
          <User className="block w-12 h-12" />
          <CardTitle>{user?.nome}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="items-center">
            <label htmlFor="" className="font-medium">
              Usuário
            </label>
            <p className="w-full">{user?.login}</p>
          </div>
          <div className="gap-1 items-center">
            <label htmlFor="" className="font-medium">
              Matrícula
            </label>
            <p className="w-full">{user?.matricula}</p>
          </div>
          <div className="items-center">
            <label htmlFor="" className="font-medium">
              Nível de acesso
            </label>
            <p className="w-full">{nivelAcesso}</p>
          </div>
          <div className="items-center">
            <label htmlFor="" className="font-medium">
              Celular
            </label>
            <p className="w-full">
              {user?.celular ?? "Não possui cadastrado."}
            </p>
          </div>
          <div className="items-center">
            <label htmlFor="" className="font-medium">
              E-mail
            </label>
            <p className="w-full">{user?.email ?? "Não possui cadastrado."}</p>
          </div>
          <div className="items-center">
            <label htmlFor="" className="font-medium">
              Setor
            </label>
            <p className="w-full">
              {user?.nome_setor ?? "Não possui cadastrado."}
            </p>
          </div>
          <div className="items-center">
            <label htmlFor="" className="font-medium">
              Cargo
            </label>
            <p className="w-full">
              {user?.nome_cargo ?? "Não possui cadastrado."}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-baseline">
        <Separator />
        <h2 className="font-medium flex gap-2 mt-4 mb-6">Trocar senha 🔒</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="senha_antiga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha antiga</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Senha antiga"
                      className="w-full"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="nova_senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nova senha"
                      className="w-full"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="repetir_nova_senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repita sua nova senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repita sua nova senha"
                      className="w-full"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button type="submit">
              {isLoading ? "Por favor, aguarde..." : "Enviar"}
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
