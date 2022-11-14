import { toast } from "react-toastify";

export function checkFileSize(file: File) {
  const maxSize = 1024 * 1024; //1mb
  if (file.size > maxSize) {
    toast("尺寸超過1MB!請壓縮檔案再重新上傳");
    return false;
  }
  return true;
}

export function checkImageType(file: File) {
  const validType = ["jpg", "jpeg", "png"];
  if (!validType.includes(file.type)) {
    toast("檔案類型不符，請重新上傳");
    return false;
  }
  return true;
}
