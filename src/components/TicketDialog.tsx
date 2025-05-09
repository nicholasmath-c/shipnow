import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FileText,
  Wrench,
  MapPin,
  Calendar,
  Clock,
  User,
  UserRoundCog,
  MessageSquarePlus,
} from "lucide-react";
import { iTicket } from "@/data/@types/ticket";
import { useAuth } from "@/data/contexts/AuthContext";
import { editTicket } from "@/data/services/ticketService";
import { useEffect, useState } from "react";
import {
  createAttachmentInUpdateTicket,
  listAllAttachmentsByTicket,
} from "@/data/services/attachmentService";
import { iAttachment } from "@/data/@types/attachment";
import { badgeColors } from "@/data/hooks/helpers";
import { iUpdateTicket, iUpdateTicketPost } from "@/data/@types/updateTicket";
import UpdateTicketComment from "./UpdateTicketComment";
import {
  createUpdateTicket,
  listAllUpdateTicketByTicket,
} from "@/data/services/updateTicketService";
import { Textarea } from "./ui/textarea";
import AttachmentDialog from "./AttachmentDialog";
import { Input } from "./ui/input";

interface TicketDialogProps {
  ticket: iTicket;
  children: React.ReactNode;
}

export default function TicketDialog({ ticket, children }: TicketDialogProps) {
  const [attachments, setAttachments] = useState<iAttachment[]>();
  const [updateTickets, setUpdateTickets] = useState<iUpdateTicket[]>();
  const [isNewUpdate, setIsNewUpdate] = useState(false);
  const [isButtonAvailable, setIsButtonAvailable] = useState(true);
  const [nivelUrgencia, setNivelUrgencia] = useState<string | null>("baixo");
  const { user } = useAuth();
  const [updateTicketForm, setUpdateTicketForm] = useState<iUpdateTicketPost>({
    id_usuario: user?.id,
    id_chamado: ticket.id,
    descricao: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const data_requisicao_raw = new Date(ticket.data_requisicao);
  const data_fechamento_raw =
    ticket.data_fechamento !== null ? new Date(ticket.data_fechamento) : null;
  const data_requisicao_formatada = data_requisicao_raw.toLocaleDateString(
    "pt-BR",
    { timeZone: "utc" }
  );
  const hora_requisicao_formatada = data_requisicao_raw.toLocaleTimeString(
    "pt-BR",
    { timeZone: "utc" }
  );

  async function confirmHandler(situacao: string) {
    console.log("funcionou");
    await editTicket(ticket.id, {
      numero_protocolo: ticket.numero_protocolo,
      id_usuario: ticket.id_solicitante,
      id_unidade: ticket.id_unidade,
      local: ticket.local,
      id_categoria: ticket.id_categoria,
      id_tecnico: user?.id as number,
      descricao: ticket.descricao,
      situacao: situacao,
      nivel_urgencia: nivelUrgencia,
      data_requisicao: data_requisicao_raw
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      data_fechamento: data_fechamento_raw
        ? data_fechamento_raw.toISOString().slice(0, 19).replace("T", " ")
        : null,
    });

    toast(
      `Chamado ${ticket.numero_protocolo} ${
        situacao === "em_andamento" ? "adicionado a sua lista." : "finalizado."
      }`,
      {
        action: {
          label: "OK",
          onClick: () => {
            return;
          },
        },
      }
    );
  }

  useEffect(() => {
    const request = async () => {
      setAttachments(await listAllAttachmentsByTicket(ticket.id));
    };

    request();
  }, [setAttachments, ticket.id]);

  useEffect(() => {
    const request = async () => {
      setUpdateTickets(await listAllUpdateTicketByTicket(ticket.id));
    };

    request();
    const interval = setInterval(request, 5000);
    return () => clearInterval(interval);
  }, [setUpdateTickets, ticket.id]);

  async function createNewUpdateTicketHandler(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    if (isButtonAvailable) {
      setIsNewUpdate(false);
      try {
        setIsButtonAvailable(false);
        const updateTicketResponse = await createUpdateTicket(updateTicketForm);

        // Se o update for criado com sucesso e tiver arquivo selecionado
        if (file && updateTicketResponse.data?.data?.id) {
          await createAttachmentInUpdateTicket(
            updateTicketResponse.data?.data?.id,
            user?.id,
            file
          );
        }

        toast.success("Atualização de chamado criada com sucesso!");
        setTimeout(() => {
          setIsButtonAvailable(true);
        }, 10000);
      } catch (error) {
        console.log(error);
        toast.error("Erro ao atualizar chamado");
      } finally {
        setUpdateTickets(await listAllUpdateTicketByTicket(ticket.id));
        setFile(null); // Limpa o arquivo depois de enviar
        setPreviewUrl(null);
      }
    } else {
      toast.error("Espere 5 segundos para tentar novamente.");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <Dialog>
      {children}
      <DialogContent className="gap-8 overflow w-200 max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{ticket.nome_unidade}</DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            <span className="text-sm font-medium">Prioridade:</span>
            <Badge
              className={`uppercase font-semibold ${badgeColors(
                ticket.nivel_urgencia as string
              )}`}
            >
              {ticket.nivel_urgencia || "A definir"}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <FileText />
            <p>
              <span className="font-medium">Nº de protocolo: </span>
              {ticket.numero_protocolo}
            </p>
          </div>
          <div className="flex gap-2">
            <Wrench />
            <p>
              <span className="font-medium">Categoria: </span>
              {ticket.nome_categoria}
            </p>
          </div>
          <div className="flex gap-2">
            <User />
            <p>
              <span className="font-medium">Solicitante: </span>
              {ticket.nome_solicitante}
            </p>
          </div>
          {!ticket.nome_tecnico || (
            <div className="flex gap-2">
              <UserRoundCog />
              <p>
                <span className="font-medium">Técnico responsável: </span>
                {ticket.nome_tecnico}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <MapPin />
            <p>
              <span className="font-medium">Local: </span>
              {ticket.local}
            </p>
          </div>
          <div className="flex gap-2">
            <Calendar />
            <p>
              <span className="font-medium">Data de abertura: </span>
              {data_requisicao_formatada}
            </p>
          </div>
          <div className="flex gap-2">
            <Clock />
            <p>
              <span className="font-medium">Horário de abertura: </span>
              {hora_requisicao_formatada}
            </p>
          </div>
        </div>

        {attachments && attachments[0] ? (
          <AttachmentDialog attachment={attachments[0]} />
        ) : null}

        <div className="w-full text-wrap">
          <h2 className="font-medium mb-2">Descrição</h2>
          <div className="p-4 border-1 rounded-md overflow-auto max-h-64 break-all">
            {ticket.descricao}
          </div>
        </div>

        {ticket.situacao !== "aberto" && (
          <div className="mt-4">
            <div className="flex justify-between items-baseline">
              <h2 className="font-semibold text-lg mb-4">
                Atualizações do chamado
              </h2>
              {((user && user?.role === "admin") ||
                (user?.role === "tech" &&
                  ticket.id_tecnico === user?.id &&
                  ticket.situacao !== "finalizado") ||
                (user?.role === "user" &&
                  ticket.id_solicitante === user?.id &&
                  ticket.situacao !== "finalizado")) && (
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    if (isNewUpdate) setIsNewUpdate(false);
                    else setIsNewUpdate(true);
                  }}
                >
                  <MessageSquarePlus />
                  Nova atualização
                </Button>
              )}
            </div>
            {isNewUpdate && (
              <form
                action=""
                className="flex my-4 flex-col gap-2"
                onSubmit={createNewUpdateTicketHandler}
              >
                <div className="flex gap-2">
                  <Avatar className="rounded-xl bg-neutral-100 flex items-center justify-center">
                    <User />
                  </Avatar>
                  <Textarea
                    name="descricao"
                    className="border-0 resize-none max-w-100"
                    placeholder="Escreva sua atualização..."
                    onChange={(e) => {
                      setUpdateTicketForm({
                        ...updateTicketForm,
                        descricao: e.target.value,
                      });
                    }}
                    required
                  ></Textarea>
                </div>
                <div className="flex gap">
                  <label htmlFor="file" className="font-medium text-sm">
                    Anexo <span className="text-neutral-500">(Opcional)</span>:
                  </label>
                  <Input
                    name="file"
                    type="file"
                    accept="image/jpg, image/jpeg, image/png, application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
                {previewUrl && (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Pré-visualização"
                      className="block w-54 border-2 rounded-md max-h-64 object-contain"
                    />
                  </div>
                )}
                <div className="flex w-full justify-end gap-2">
                  <Button
                    variant={"outline"}
                    onClick={() => setIsNewUpdate(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Enviar</Button>
                </div>
              </form>
            )}
            {updateTickets?.map((updateTicket) => (
              <UpdateTicketComment updateTicket={updateTicket} />
            ))}
          </div>
        )}

        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"} className="w-full">
              Fechar
            </Button>
          </DialogClose>
          {ticket.situacao === "aberto" && user?.role !== "user" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Atender chamado</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja atender este chamado?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação irá atribuir o chamado a você e apenas um
                    administrador do sistema será capaz de efetuar a troca de
                    técnico.
                  </AlertDialogDescription>
                  <label
                    htmlFor="nivel_urgencia"
                    className="text-sm font-medium text-neutral-500"
                  >
                    Nivel de urgência:
                  </label>
                  <Select
                    name="nivel_urgencia"
                    onValueChange={(value) => {
                      setNivelUrgencia(value);
                      console.log(value);
                    }}
                    value={nivelUrgencia || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o nível de urgência..." />
                    </SelectTrigger>
                    <SelectContent>
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
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => confirmHandler("em_andamento")}
                  >
                    <DialogClose className="cursor-pointer">
                      Sim, tenho certeza
                    </DialogClose>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {ticket.situacao === "em_andamento" && user?.role !== "user" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Finalizar chamado</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja finalizar este chamado?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação irá finalizar o chamado e apenas um administrador
                    do sistema será capaz de desfazer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => confirmHandler("finalizado")}
                  >
                    <DialogClose className="cursor-pointer">
                      Sim, tenho certeza
                    </DialogClose>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
