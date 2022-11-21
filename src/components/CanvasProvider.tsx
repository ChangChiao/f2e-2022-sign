import { createContext, RefObject, ReactNode, useContext, useRef } from "react";
import { Canvas } from "fabric/fabric-impl";

interface CanvasContextInterface {
  canvas: RefObject<Canvas> ;
  getCanvas: () => void;
  setCanvas: (file: Canvas) => void;
}

const CanvasContext = createContext<CanvasContextInterface>(
  {} as CanvasContextInterface
);

const CanvasContextProvider = ({ children }: { children: ReactNode }) => {
  const canvas = useRef<Canvas | null>(null);

    const getCanvas = () => {
        return canvas;
    };

  const setCanvas = (param: Canvas | null) => {
    canvas.current = param;
  };
  return (
    <CanvasContext.Provider
      value={{
        canvas,
        getCanvas,
        setCanvas,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);

export default CanvasContextProvider;
