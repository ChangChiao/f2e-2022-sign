import { createContext, RefObject, ReactNode, useContext, useRef } from "react";

interface FileContextInterface {
  file: RefObject<File> ;
  getFile: () => void;
  setFile: (file: File) => void;
}

const FileContext = createContext<FileContextInterface>(
  {} as FileContextInterface
);

const FileContextProvider = ({ children }: { children: ReactNode }) => {
  const file = useRef< File | null>(null);

  const getFile = () => {
    return file;
  };

  const setFile = (param: File) => {
    file.current = param;
  };
  return (
    <FileContext.Provider
      value={{
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
