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
import { iUpdateTicket } from "@/data/@types/updateTicket";
import { Avatar } from "./ui/avatar";
import { Trash, User } from "lucide-react";
import AttachmentDialog from "./AttachmentDialog";
import { iAttachment } from "@/data/@types/attachment";
import { useEffect, useState } from "react";
import { listAllAttachmentsByUpdateTicket } from "@/data/services/attachmentService";
import { toast } from "sonner";
import { SkeletonComment } from "./SkeletonComment";
import { Button } from "./ui/button";
import { deleteUpdateTicket } from "@/data/services/updateTicketService";
import { useAuth } from "@/data/contexts/AuthContext";

interface UpdateTicketCommentProps {
  updateTicket: iUpdateTicket;
}

export default function UpdateTicketComment({
  updateTicket,
}: UpdateTicketCommentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [attachments, setAttachments] = useState<iAttachment[]>();
  const { user } = useAuth();

  const data_atualizacao_raw = new Date(updateTicket.data_atualizacao);
  const data_atualizacao_formatada = data_atualizacao_raw.toLocaleString(
    "pt-BR",
    { timeZone: "utc" }
  );

  useEffect(() => {
    const request = async () => {
      try {
        setAttachments(await listAllAttachmentsByUpdateTicket(updateTicket.id));
      } catch (error) {
        toast.error("Erro ao puxar os anexos das atualizações de chamado");
      } finally {
        setIsLoading(false);
      }
    };

    request();
  }, [setAttachments, updateTicket]);

  async function onDeleteHandler() {
    try {
      await deleteUpdateTicket(updateTicket.id);
    } catch (error) {
      toast.error("Erro ao excluir a atualização do chamado.");
    } finally {
      toast.success("Atualização de chamado excluída com sucesso.");
    }
  }

  if (isLoading) {
    return <SkeletonComment />;
  }

  return (
    <div
      className={`border-1 rounded-md p-4 my-2 ${
        updateTicket.descricao === "Chamado finalizado" &&
        "bg-emerald-600 text-white"
      }`}
    >
      <div className="flex justify-between gap-2 items-center">
        <div className="flex items-center gap-2">
          <Avatar
            className={`h-8 w-8 rounded-xl flex items-center justify-center bg-transparent`}
          >
            <User />
          </Avatar>
          <p>{updateTicket.nome_usuario}</p>
        </div>
        <p className="text-right">{data_atualizacao_formatada}</p>

        {user?.role === "admin" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-8 h-8 bg-rose-600 hover:bg-rose-500">
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja excluir essa atualização de chamado?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação é irreversível e irá excluir registros.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={() => {
                    onDeleteHandler();
                  }}
                >
                  Sim, tenho certeza
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <div className="w-full text-wrap my-4">
        <div className="p-4 overflow-auto max-h-32 break-all">
          {updateTicket.descricao}
        </div>
      </div>
      <div className="flex w-full justify-center">
        {attachments && attachments[0] ? (
          <AttachmentDialog attachment={attachments[0]} />
        ) : null}
      </div>
    </div>
  );
}
