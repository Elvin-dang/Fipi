export const toFileSize = (size: number) => {
  const fSExt = new Array("Bytes", "KB", "MB", "GB");
  let i = 0;
  while (size > 900) {
    size /= 1024;
    i++;
  }
  return Math.round(size * 100) / 100 + " " + fSExt[i];
};
