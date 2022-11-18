import { createContext, RefObject, ReactNode, useContext, useRef, useState } from "react";
import { fileToBase64, base64ToFile } from "../utils/saveLocal";

interface FileContextInterface {
  file: RefObject<File> ;
  fileName: string;
  setFileName: (name: string) => void;
  getFile: () => void;
  setFile: (file: File) => void;
}

const FileContext = createContext<FileContextInterface>(
  {} as FileContextInterface
);

const FileContextProvider = ({ children }: { children: ReactNode }) => {
  const file = useRef< File | null>(null);
  const [fileName, setFileName] = useState('');

  const getFile = () => {
    const doc = localStorage.getItem("doc")
    if(doc){
      const docFile = base64ToFile(doc);
      console.log('docFile', docFile);  
    }
    return file;
  };

  const setFile = async (param: File) => {
    const name = param.name;
    setFileName(name);
    file.current = param;
    try {
      const str = await fileToBase64(param)
      localStorage.setItem('doc', str);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FileContext.Provider
      value={{
        fileName,
        setFileName,
        file,
        getFile,
        setFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => useContext(FileContext);

export default FileContextProvider;
