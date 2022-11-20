import { toast } from "react-toastify";

export function checkFileSize(file: File) {
  const maxSize = 1024 * 1024 * 10; //10mb
  if (file.size > maxSize) {
    toast.error("尺寸超過10MB!請壓縮檔案再重新上傳");
    return false;
  }
  return true;
}

export function checkImageType(file: File) {
  const validType = ["image/jpg", "image/jpeg", "image/png"];
  
  if (!validType.includes(file.type)) {
    toast.error("檔案類型不符，請重新上傳");
    console.log('檔案類型不符，請重新上傳');
    
    return false;
  }
  return true;
}
