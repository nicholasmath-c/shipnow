export interface iAttachment {
  id: number;
  numero_protocolo_chamado: string;
  login_usuario: string;
  nome_arquivo: string;
  tipo_arquivo: string;
  tamanho: number;
  tipo: string;
  dados: {
    data: ArrayBuffer | ArrayLike<number>;
  };
  data_upload: string;
}

export interface iAttachmentPost {
  file: Blob;
  id_usuario: number;
}
