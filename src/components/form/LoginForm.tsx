"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/data/contexts/AuthContext.tsx";
import { login } from "@/data/services/authService.ts";

const formSchema = z.object({
  username: z.string(),
  password: z.string().min(8, {
    message: "Senha deve possuir no mínimo 8 caracteres.",
  }),
});

export default function LoginForm() {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const response = await login(values.username, values.password);
    if (response.status === 200) {
      setToken(response.data.user.accessToken);
      setUser({
        id: response.data.user.id,
        name: response.data.user.name,
        login: response.data.user.login,
        role: response.data.user.role,
      });
      navigate("/");
    } else if (response.status === 400) {
      form.setError("username", {
        type: "manual",
        message: response.data.message,
      });
    } else if (response.status === 403) {
      form.setError("password", {
        type: "manual",
        message: response.data.message,
      });
    } else {
      return;
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-7"
      >
        <div className="flex flex-col gap-6 text-start mb-10">
          <h1 className="text-4xl font-semibold text-secondary font-heading">Seja bem vindo</h1>
          <p className="text-sm">
            Inicie sessão na sua conta através do seu nome de utilizador.
          </p>
        </div>
        {form.formState.errors.root && (
          <div className="text-red-500 mb-4">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Utilizador</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Usuário"
                  {...field}
                  required
                ></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Senha</FormLabel>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Esqueceu-se sua senha?
                </a>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Senha"
                  {...field}
                  required
                ></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <Button type="submit" className="cursor-pointer">
          {isLoading ? "Por favor, aguarde..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
