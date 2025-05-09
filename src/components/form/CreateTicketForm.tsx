"use client";

import { Wrench, MapPin, FileImage, House, Text } from "lucide-react";
import { z } from "zod";
import { useEffect, useState } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/data/contexts/AuthContext.tsx";
import { Textarea } from "../ui/textarea.tsx";
import { iCategory } from "@/data/@types/category.ts";
import { iUnit } from "@/data/@types/unit.ts";
import { listAllUnities } from "@/data/services/unitService.ts";
import { listAllCategories } from "@/data/services/categoryService.ts";
import { createTicket } from "@/data/services/ticketService.ts";
import { toast } from "sonner";
import { createAttachment } from "@/data/services/attachmentService.ts";

import SPLoader from "../SpinnerLoader.tsx";
const formSchema = z.object({
  unidade: z.number({ required_error: "Selecione a unidade." }).nullable(),
  local: z.string({ required_error: "Digite o local." }),
  categoria: z.number({ required_error: "Selecione a categoria." }).nullable(),
  descricao: z.string().optional(),
  file: z
    .any()
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= 5_000_000,
      {
        message: "O arquivo deve ter no máximo 5MB",
      }
    )
    .optional(),
});

export default function CreateTicketForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [categories, setCategories] = useState<iCategory[]>();
  const [unities, setUnities] = useState<iUnit[]>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue("file", e.target.files);
    } else {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const request = async () => {
      try {
        setCategories(await listAllCategories());
        setUnities(await listAllUnities());
      } catch (error) {
        toast.error("Erro ao carregar unidades e categorias");
      } finally {
        setIsLoading(false);
      }
    };

    request();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unidade: null,
      local: "",
      categoria: null,
      descricao: "",
      file: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 1. Cria o ticket primeiro
      const ticketRequest = await createTicket({
        id_usuario: user?.id,
        id_unidade: values.unidade,
        id_categoria: values.categoria,
        local: values.local,
        descricao: values.descricao,
      });

      if (ticketRequest.status === 201) {
        // 2. Se tiver arquivo, faz upload
        if (values.file && values.file.length > 0) {
          const formData = new FormData();
          formData.append("file", values.file[0]); // Pega o primeiro arquivo

          try {
            if (values.file && values.file[0]) {
              const attachmentRequest = await createAttachment(
                ticketRequest.data.data.id,
                user?.id,
                values.file[0]
              );

              if (attachmentRequest.status === 201) {
                toast.success("Chamado criado com sucesso!");
                navigate("/tickets");
              }
            }
          } catch (error) {
            toast.error("Chamado criado, mas falha no anexo");
          }
        } else {
          toast.success("Chamado criado com sucesso!");
          form.reset();
          navigate("/tickets", { viewTransition: false });
        }
      }
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      toast.error("Erro ao criar chamado");
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mt-24">
        <SPLoader />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Abrir um novo chamado</CardTitle>
        <CardDescription>
          Utilize o formulário abaixo para abrir um chamado no HelpDesk.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <Form {...form}>
          {form.formState.errors.root && (
            <div className="text-red-500 mb-4">
              {form.formState.errors.root.message}
            </div>
          )}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-7"
            encType="multipart/form-data"
          >
            <FormField
              control={form.control}
              name="unidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <House className="w-5" />
                    Unidade
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selectedUnit = unities?.find(
                        (unit) => unit.nome === value
                      );
                      field.onChange(selectedUnit?.id);
                    }}
                    value={
                      unities?.find((u) => u.id === field.value)?.nome || ""
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a sua unidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unities?.map((unit) => (
                        <SelectItem key={unit.id} value={unit.nome}>
                          {unit.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Escolha a sua unidade</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <MapPin className="w-5" />
                    Local
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Local" {...field}></Input>
                  </FormControl>
                  <FormDescription>
                    Informe o local dentro da unidade que está necessitando de
                    assistência (ex: Farmácia, Recepção, etc...)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Wrench className="w-5" />
                    Categoria
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selectedCat = categories?.find(
                        (cat) => cat.nome === value
                      );
                      field.onChange(selectedCat?.id);
                    }}
                    value={
                      categories?.find((cat) => cat.id === field.value)?.nome ||
                      ""
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.nome}>
                          {category.nome}{" "}
                          <span className="text-neutral-400">
                            ({category.descricao})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecione aqui o motivo do chamado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Text className="w-5" />
                    Descrição
                    <span className="text-neutral-500">(Opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      onChange={field.onChange}
                      className="resize-none max-h-100"
                    ></Textarea>
                  </FormControl>
                  <FormDescription>
                    Descreva o motivo do chamado.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>
                    <FileImage className="w-5" />
                    Anexo <span className="text-neutral-500">(Opcional)</span>
                  </FormLabel>
                  <div>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/jpg, image/jpeg, image/png, application/pdf"
                        {...rest}
                        onChange={(e) => handleFileChange(e)} // Armazena a FileList
                      />
                    </FormControl>
                    {previewUrl && (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Pré-visualização"
                          className="block w-54 border-2 rounded-md max-h-64 object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    Faça upload de um anexo para mostrar melhor o problema
                    apontado. Máximo de 5MB (jpg, jpeg, png, pdf)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="cursor-pointer">
              {isLoading ? "Por favor, aguarde..." : "Abrir chamado"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
