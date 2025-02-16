import JSZip from "jszip";
import { toast } from "sonner";

export const toFileSize = (size: number) => {
  const fSExt = new Array("Bytes", "KB", "MB", "GB");
  let i = 0;
  while (size > 900) {
    size /= 1024;
    i++;
  }
  return Math.round(size * 100) / 100 + " " + fSExt[i];
};

export const downloadFile = (blob: Blob, filename: string) => {
  if (!window) {
    return;
  }
  const blobUrl = window.URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.download = filename;
  anchor.href = blobUrl;
  anchor.click();
  window.URL.revokeObjectURL(blobUrl);
};

export const reduceFiles = async (files: FileList, id: string) => {
  if (files.length === 1) {
    return Promise.resolve(files[0]);
  }

  const zip = new JSZip();

  Array.prototype.forEach.call(files, (file) => {
    zip.file(file.name, file);
  });

  toast.loading("Zipping files...", { id });
  const blob = await zip.generateAsync({ type: "blob", streamFiles: true });
  toast.dismiss(id);

  return new File(
    [blob],
    `Fipi-${new Date().toISOString().substring(0, 19).replace("T", "-")}.zip`,
    {
      type: "application/zip",
    }
  );
};
