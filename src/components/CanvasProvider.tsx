import { createContext, RefObject, ReactNode, useContext, useRef } from "react";
import { Canvas } from "fabric/fabric-impl";

interface CanvasContextInterface {
  fabricObject: RefObject<Canvas> ;
  getFabricObject: () => void;
  setFabricObject: (file: Canvas) => void;
}

const CanvasContext = createContext<CanvasContextInterface>(
  {} as CanvasContextInterface
);

const CanvasContextProvider = ({ children }: { children: ReactNode }) => {
  const fabricObject = useRef<Canvas | null>(null);

    const getFabricObject = () => {
        return fabricObject;
    };

  const setFabricObject = (param: Canvas) => {
    fabricObject.current = param;
  };
  return (
    <CanvasContext.Provider
      value={{
        fabricObject,
        getFabricObject,
        setFabricObject,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);

export default CanvasContextProvider;
