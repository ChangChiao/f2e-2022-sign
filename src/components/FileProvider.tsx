import {
  createContext,
  RefObject,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { fileToBase64, base64ToFile } from "../utils/converFile";
import { useCanvas } from "./CanvasProvider";
interface FileContextInterface {
  file: RefObject<File>;
  fileName: string;
  sequence: string[];
  totalPages: number;
  setTotalPages: (pages: number) => void;
  nowPage: number;
  setNowPage: (pages: number) => void;
  setSequence: (str: string[]) => void;
  saveSequence: (order?: number, canvas?: HTMLCanvasElement) => void;
  getFileName: () => string;
  setFileNameLocal: (name: string) => void;
  getFile: () => RefObject<File> | null;
  setFile: (file: File) => void;
  resetFile: () => void;
}

const FileContext = createContext<FileContextInterface>(
  {} as FileContextInterface
);

const FileContextProvider = ({ children }: { children: ReactNode }) => {
  const { canvas } = useCanvas();
  const file = useRef<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [sequence, setSequence] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [nowPage, setNowPage] = useState(1);

  const saveSequence = (order?: number, canvasEle?: HTMLCanvasElement) => {
    const canvasEleURL = canvasEle?.toDataURL();
    const canvasURL = canvas.current!.toDataURL({ format: "image/png" });

    const target = canvasEleURL ?? canvasURL;
    const newArr = [...sequence];
    console.log("sequence-- .order", order);
    console.log("sequence-- .nowPage", nowPage);
    newArr[(order ?? nowPage) - 1] = target ?? "";
    console.log("sequence-- newArr", newArr);

    // setSequence(newArr);
    setSequence((prevState) => {
      console.log("sequence-- .prevState", prevState);
      const newArr = [...prevState];
      newArr[(order ?? nowPage) - 1] = target ?? "";
      return newArr;
    });
  };

  const getFile = () => {
    if (file.current) return file;
    const doc = localStorage.getItem("doc");
    if (doc) {
      const docFile = base64ToFile(fileName);
      file.current = docFile!;
    }
    return file;
  };

  const getFileName = () => {
    if (fileName) return fileName;
    const local = localStorage.getItem("fileName");
    if (local) {
      setFileName(local);
    }
    return local ?? "";
  };

  const setFileNameLocal = (name: string) => {
    localStorage.setItem("fileName", name);
    setFileName(name);
  };

  const setFile = async (param: File) => {
    const name = param.name;
    setFileNameLocal(name);
    file.current = param;
    try {
      const str = await fileToBase64(param);
      localStorage.setItem("doc", str);
    } catch (error) {
      console.log(error);
    }
  };

  const resetFile = () => {
    setSequence([]);
    setNowPage(1);
    setTotalPages(0);
    setFileNameLocal("");
    file.current = null;
  };

  return (
    <FileContext.Provider
      value={{
        sequence,
        setSequence,
        saveSequence,
        nowPage,
        setNowPage,
        totalPages,
        setTotalPages,
        fileName,
        getFileName,
        setFileNameLocal,
        file,
        getFile,
        setFile,
        resetFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => useContext(FileContext);

export default FileContextProvider;
