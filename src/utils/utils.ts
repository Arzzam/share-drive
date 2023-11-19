export const formatBytes = (bytes: number, decimals?: number): string => {
  if (bytes == 0) return '0 Byte';
  const k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  // return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
};

export const isLargeFile = (fileSize: number | null): boolean => {
  if (fileSize === null) return false;
  const fileSizeInKB = fileSize / 1024;
  if (fileSizeInKB > 4096) {
    return true;
  } else return false;
};
