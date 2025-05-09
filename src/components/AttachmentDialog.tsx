import { iAttachment } from "@/data/@types/attachment";
import { Button } from "./ui/button";
import { useState } from "react";
import { Download, FileImage } from "lucide-react";
import { createImageURLByAttachment } from "@/data/hooks/helpers";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";

interface AttachmentDialogProps {
  attachment: iAttachment;
}

export default function AttachmentDialog({
  attachment,
}: AttachmentDialogProps) {
  const [attachmentImage, setAttachmentImage] = useState<string | undefined>();

  function openAttachmentHandler() {
    if (attachment?.dados) {
      try {
        setAttachmentImage(createImageURLByAttachment(attachment));
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div>
          <Button onClick={openAttachmentHandler} variant={"outline"}>
            <FileImage />
            Ver Anexo
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Anexo</DialogTitle>
        <DialogDescription>
          Arquivo que o usuário anexou juntamente ao chamado
        </DialogDescription>
        {attachment.tipo_arquivo === "application/pdf" ? (
          <object
            data={attachmentImage}
            type="application/pdf"
            width="100%"
            height="100%"
            className="min-h-128"
          ></object>
        ) : (
          <img src={attachmentImage} alt="" className="rounded-md" />
        )}

        <Button>
          <a
            href={attachmentImage}
            download
            className="flex items-center gap-2"
          >
            <Download />
            Fazer Download
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
