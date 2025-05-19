"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Wrench,
  MapPin,
  UserRoundCog,
  FileImage,
  House,
  Text,
  CalendarClock,
  CircleAlert,
} from "lucide-react";
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
import { editTicket } from "@/data/services/ticketService.ts";
import { toast } from "sonner";
import {
  createAttachment,
  deleteAttachment,
  listAllAttachmentsByTicket,
} from "@/data/services/attachmentService.ts";
import { iTicket } from "@/data/@types/ticket.ts";
import { iAttachment } from "@/data/@types/attachment.ts";
import { createImageURLByAttachment } from "@/data/hooks/helpers";
import SPLoader from "../SpinnerLoader.tsx";
import { iUser } from "@/data/@types/user.ts";
import { listAllUsers } from "@/data/services/userService.ts";


const formSchema = z.object({
  unidade: z.number({ required_error: "Selecione a unidade." }),
  local: z.string().min(1, "Digite o local.").nullable(), // Não permite null/empty
  categoria: z.number({ required_error: "Selecione a categoria." }),
  tecnico: z.number().nullable(),
  descricao: z.string().nullable(),
  situacao: z.string(),
  nivel_urgencia: z.string().nullable(),
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

interface EditTicketFormProps {
  ticket: iTicket;
}

export default function EditTicketForm({ ticket }: EditTicketFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [categories, setCategories] = useState<iCategory[]>();
  const [unities, setUnities] = useState<iUnit[]>();
  const [techs, setTechs] = useState<iUser[]>();
  const [attachment, setAttachment] = useState<iAttachment[]>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<File | null>(null);
  const data_requisicao_raw = new Date(ticket.data_requisicao);
  const data_fechamento_raw =
    ticket.data_fechamento !== null ? new Date(ticket.data_fechamento) : null;

  useEffect(() => {
    console.log(ticket);
    const loadData = async () => {
      try {
        const [cats, units, attachments] = await Promise.all([
          listAllCategories(),
          listAllUnities(),
          listAllAttachmentsByTicket(ticket.id),
        ]);
        if (user?.role === "admin") {
          const techs = await listAllUsers();
          setTechs(techs);
        }
        setCategories(cats);
        setUnities(units);
        setAttachment(attachments);
      } catch (error) {
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [ticket.id]);

  useEffect(() => {
    if (attachment && attachment[0]) {
      // Simula um objeto File com os dados do anexo existente
      const mockFile = new File([], attachment[0].nome_arquivo, {
        type: attachment[0].tipo,
      });
      setExistingFile(mockFile);
    }
  }, [attachment]);

  useEffect(() => {
    if (attachment) {
      console.log(attachment);
      setImageUrl(createImageURLByAttachment(attachment[0]));
    }
  }, [attachment]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unidade: ticket.id_unidade,
      local: ticket.local,
      categoria: ticket.id_categoria,
      tecnico: ticket.id_tecnico,
      descricao: ticket?.descricao,
      situacao: ticket.situacao,
      nivel_urgencia:
        ticket.nivel_urgencia === null ? "definir" : ticket.nivel_urgencia,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 1. Atualiza o ticket
      const updateResponse = await editTicket(ticket.id, {
        numero_protocolo: ticket.numero_protocolo,
        id_usuario: ticket.id_solicitante,
        id_unidade: values.unidade,
        id_categoria: values.categoria,
        id_tecnico: values.tecnico ?? ticket.id_tecnico,
        local: values.local,
        descricao: values.descricao,
        situacao: values.situacao ?? ticket.situacao,
        nivel_urgencia:
          values.nivel_urgencia === "definir" ? null : values.nivel_urgencia,
        data_requisicao: data_requisicao_raw
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        data_fechamento: data_fechamento_raw
          ? data_fechamento_raw.toISOString().slice(0, 19).replace("T", " ")
          : null,
      });

      if (updateResponse.status === 200) {
        // 2. Se um novo arquivo foi selecionado
        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);

          // Remove o anexo existente primeiro (se existir)
          if (attachment && attachment[0]) {
            await deleteAttachment(attachment[0].id);
          }

          // Adiciona o novo anexo
          await createAttachment(ticket.id, user?.id, selectedFile);
        }

        toast.success(
          `Chamado ${ticket.numero_protocolo} atualizado com sucesso!`,
          {
            action: {
              label: "OK",
              onClick: () => {
                return;
              },
            },
          }
        );

        navigate("/tickets");
      }
    } catch (error) {
      console.error("Erro ao atualizar ticket:", error);
      toast.error("Erro ao atualizar chamado");
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
        <CardTitle className="text-xl">
          Editar chamado - {ticket.numero_protocolo}
        </CardTitle>
        <CardDescription>
          Utilize o formulário abaixo para editar o chamado.
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
                    key={unities?.find((u) => u.id === field.value)?.id || ""}
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
            />
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
                    <Input
                      type="text"
                      placeholder="Local"
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value ?? ""}
                      ref={field.ref}
                    />
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
                        (c) => c.nome === value
                      );
                      field.onChange(selectedCat?.id);
                    }}
                    value={
                      categories?.find((c) => c.id === field.value)?.nome || ""
                    }
                    key={
                      categories?.find((c) => c.id === field.value)?.id || ""
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
            />
            {user && user?.role === "admin" && (
              <FormField
                control={form.control}
                name="tecnico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <UserRoundCog className="w-5" /> Técnico
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const selectedTech = techs?.find(
                          (tech) => tech.nome === value
                        );
                        field.onChange(selectedTech?.id);
                      }}
                      key={techs?.find((t) => t.id === field.value)?.id || ""}
                      value={
                        techs?.find((t) => t.id === field.value)?.nome || ""
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o técnico" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {techs
                          ?.filter((tech) => tech.nivel_acesso !== "user")
                          .map((tech) => (
                            <SelectItem key={tech.id} value={tech.nome}>
                              {tech.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecione o técnico responsável pelo atendimento deste
                      chamado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                      {...field}
                      value={field.value || ""}
                      className="resize-none max-h-100"
                    />
                  </FormControl>
                  <FormDescription>
                    Descreva o motivo do chamado.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            {user && user.role === "admin" && (
              <>
                <FormField
                  control={form.control}
                  name="situacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <CalendarClock className="w-5" />
                        Situação
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value || ""}
                          key={
                            field.value === "aberto"
                              ? 1
                              : field.value === "em_andamento"
                              ? 2
                              : 3
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione a situação" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key={1} value={"aberto"}>
                              Aberto
                            </SelectItem>
                            <SelectItem key={2} value={"em_andamento"}>
                              Em Andamento
                            </SelectItem>
                            <SelectItem key={3} value={"finalizado"}>
                              Finalizado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Qual a situação do chamado?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="nivel_urgencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <CircleAlert className="w-5" />
                        Nivel de Urgência
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value || ""}
                          key={
                            field.value === "baixo"
                              ? 1
                              : field.value === "medio"
                              ? 2
                              : 3
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione a situação" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key={0} value={"definir"}>
                              A Definir
                            </SelectItem>
                            <SelectItem key={1} value={"baixo"}>
                              Baixo
                            </SelectItem>
                            <SelectItem key={2} value={"medio"}>
                              Medio
                            </SelectItem>
                            <SelectItem key={3} value={"alto"}>
                              Alto
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Aponte o nível de urgência do chamado.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </>
            )}
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>
                    <FileImage className="w-5" /> Anexo{" "}
                    <span className="text-neutral-500">(Opcional)</span>
                  </FormLabel>
                  <div className="flex flex-col gap-4">
                    <FormControl>
                      <Input
                        type="file"
                        {...rest}
                        accept="image/jpg, image/jpeg, image/png, application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            // Cria URL temporária para pré-visualização
                            const newImageUrl = URL.createObjectURL(file);
                            setImageUrl(newImageUrl);
                          }
                          onChange(e.target.files);
                        }}
                      />
                    </FormControl>
                    {imageUrl && (
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="block w-54 border-2 rounded-md max-h-64 object-contain"
                        />
                        {existingFile && !selectedFile && (
                          <div className="mt-2 text-sm text-gray-500">
                            Arquivo atual: {existingFile.name}
                          </div>
                        )}
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
              {isLoading ? "Por favor, aguarde..." : "Editar chamado"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
