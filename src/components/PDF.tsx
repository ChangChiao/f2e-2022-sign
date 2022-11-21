import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { fabric } from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import { useFile } from "@/components/FileProvider";
import { Flex, Box, Image } from "@chakra-ui/react";
import { useCanvas } from "./CanvasProvider";
import BtnGroup from "@/components/BtnGroup";
const pdf = new jsPDF();
// @ts-ignore
const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
const Base64Prefix = "data:application/pdf;base64,";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://mozilla.github.io/pdf.js/build/pdf.worker.js";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// let canvas: Canvas | null = null;
let multiple = 1;

const PDF = () => {
  const {
    file,
    fileName,
    getFile,
    sequence,
    totalPages,
    setTotalPages,
    nowPage,
    setNowPage,
    saveSequence,
  } = useFile();
  const { canvas, setCanvas } = useCanvas();
  const initFlag = useRef(false);
  const canvasEle = useRef<HTMLCanvasElement>(null);
  const pdfWrapper = useRef<HTMLDivElement>(null);
  const readBlob = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", reject);
      reader.readAsDataURL(blob);
    });
  };

  const genPDFCanvas = async (
    paramPDF: File,
    isFromSequence?: boolean,
    order?: number
  ): Promise<HTMLCanvasElement | null> => {
    // 將檔案處理成 base64
    let pdfData = "";
    pdfData = (await readBlob(paramPDF)) as string;
    // 將 base64 中的前綴刪去，並進行解碼
    const data = window.atob(pdfData.substring(Base64Prefix.length));

    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;

    let targetPage = nowPage;
    if (isFromSequence) targetPage = 1;
    if (order) targetPage = order;
    const pdfPage = await pdfDoc.getPage(targetPage);

    if (totalPages === 0) {
      setTotalPages(pdfDoc.numPages);
    }

    // create canvas
    const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });

    const newCanvas = document.createElement("canvas");
    const context = newCanvas.getContext("2d");

    newCanvas.height = viewport.height;
    newCanvas.width = viewport.width;
    const renderContext = {
      canvasContext: context!,
      viewport,
    };
    const renderTask = pdfPage.render(renderContext);
    // 回傳做好的 PDF canvas
    return renderTask.promise.then(() => newCanvas);
  };

  const pdfToImage = async (pdfData: HTMLCanvasElement) => {
    // 設定 PDF 轉為圖片時的比例
    const scale = 1 / window.devicePixelRatio;
    // 回傳圖片
    return new fabric.Image(pdfData, {
      // @ts-ignore
      id: "renderPDF",
      scaleX: scale,
      scaleY: scale,
    });
  };

  const handleCanvasWidth = (pdfImage: fabric.Image, order?: number) => {
    // 透過比例設定 canvas 尺寸
    canvas.current!.setWidth(pdfImage.width! / window.devicePixelRatio);
    canvas.current!.setHeight(pdfImage.height! / window.devicePixelRatio);

    canvas.current!.setBackgroundImage(
      pdfImage,
      canvas.current!.renderAll.bind(canvas.current)
    );
  };

  const handlePDFInit = async (
    fileParam: File,
    isFromSequence?: boolean,
    order?: number
  ) => {
    if(canvas.current!.getObjects()){
      canvas.current!.remove(...canvas.current!.getObjects());
    }
    canvas.current!.requestRenderAll();
    if (!fileParam) return;

    const pdfData = await genPDFCanvas(fileParam!, isFromSequence, order);
    if (order) {
      console.warn('sequence-- order', order);
      saveSequence(order, pdfData!);
      setTimeout(() => {
          console.warn('sequence-- .length', sequence.length);
          
      }, 5000);
      return;
    }
    const pdfImage = await pdfToImage(pdfData!);
    handleCanvasWidth(pdfImage, order);
  };

  const getFromSequence = () => {
    const target = sequence[nowPage - 1];

    const width = pdf.internal.pageSize.width;
    const height = pdf.internal.pageSize.height;
    if (target) {
      pdf.addImage(target, "png", 0, 0, width, height);
      const blob = pdf.output("blob");
      const newFile = new File([blob], fileName, { type: "application/pdf" });
      handlePDFInit(newFile, true);
    }
  };

  const range = (number: number, max: number, min: number) => {
    return Math.max(min, Math.min(number, max));
  };

  const scale = (type: string) => {
    if (type === "plus") {
      multiple += 0.1;
    } else {
      multiple -= 0.1;
    }
    multiple = range(multiple, 2, 1);
    canvas.current!.setZoom(multiple);
  };

  const fitScreen = () => {
    const wrapperHeight = pdfWrapper.current!.clientHeight;
    const canvasHeiight = canvasEle.current!.clientHeight;
    const rate = Number((wrapperHeight / canvasHeiight).toFixed(2));
    console.log("rate", rate);

    canvas.current!.setZoom(rate);
  };

  const setPage = (type: string) => {
    let page = nowPage;
    if (type === "plus") {
      page += 1;
    } else {
      page -= 1;
    }
    page = range(page, totalPages, 1);
    saveSequence();
    setNowPage(page);
  };

  const collectSequence = (pages: number) => {
    console.log('pages', pages);
    
    const docFile = getFile();
    Array.from({ length: pages }, (doc, i) => {
      console.warn('sequence-- i', i);
      handlePDFInit(docFile?.current!, false, i + 1);
    });
  };

  const deleteObject = (eventData: MouseEvent, transform: fabric.Transform) => {
    const target = transform.target;
    const objCanvas = target.canvas;
    objCanvas!.remove(target);
    objCanvas!.requestRenderAll();
    return true;
  };

  const addDeleteBtn = () => {
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      cursorStyle: "pointer",
      mouseUpHandler: deleteObject,
      render: renderCloseBtn,
    });
  };

  const renderCloseBtn = (
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: unknown,
    fabricObject: fabric.Object
  ) => {
    const img = document.createElement("img");
    // img.src = CheckedSome;
    img.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMzhfMTQ2MjEpIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxXzMzMzhfMTQ2MjEpIj4KPHBhdGggZD0iTTggOEg0MFY0MEg4VjhaIiBmaWxsPSIjMEI3RDc3Ii8+CjxwYXRoIGQ9Ik0zMy4zMzM0IDI1LjMzMzJIMTQuNjY2N1YyMi42NjY1SDMzLjMzMzRWMjUuMzMzMloiIGZpbGw9IndoaXRlIi8+CjwvZz4KPHBhdGggZD0iTTM4IDEwVjM4SDEwVjEwSDM4Wk0zOCA2SDEwQzcuOCA2IDYgNy44IDYgMTBWMzhDNiA0MC4yIDcuOCA0MiAxMCA0MkgzOEM0MC4yIDQyIDQyIDQwLjIgNDIgMzhWMTBDNDIgNy44IDQwLjIgNiAzOCA2WiIgZmlsbD0iIzBCN0Q3NyIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMzhfMTQ2MjEiPgo8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMzOF8xNDYyMSI+CjxyZWN0IHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDggOCkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K";
    const size = 30;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  };

  const initFabric = () => {
    const fabricObject = new fabric.Canvas("canvasPDF", {
      // width: pdfWrapper.current?.clientWidth,
      // height: pdfWrapper.current?.clientHeight,
    });
    console.log('fabricObject', fabricObject);
    
    setCanvas(fabricObject);
    const canvasEle = document.getElementById("canvasPDF");
    console.log('canvasEle', canvasEle);
    
    canvasEle!.style.width = `${pdfWrapper.current?.clientWidth}px`;
    canvasEle!.style.height = `${pdfWrapper.current?.clientHeight}px`;
  }

  useEffect(() => {
    totalPages !== 0 && collectSequence(totalPages);
  }, [totalPages]);

  useEffect(() => {
    console.log('canvas.current', canvas.current);
    
    if (!canvas.current) {
      initFabric()
      // return;
    }

    if (sequence[nowPage - 1]) {
      getFromSequence();
    } else {
      
      const docFile = getFile();      
      console.log('docFile', docFile?.current!);
      handlePDFInit(docFile?.current!);
    }
  }, [nowPage]);

  useEffect(() => {
    addDeleteBtn();
    return () => {
      setCanvas(null)
    }
  }, []);

  return (
    <Box
      flex="1"
      ref={pdfWrapper}
      w={{ base: "90%", lg: "auto" }}
      overflowY={"scroll"}
      overflowX={{ base: "scroll", lg: "hidden" }}
      position={"relative"}
      backgroundColor={"gray.200"}
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "gray.300",
          borderRadius: "24px",
        },
      }}
    >
        <canvas
          id="canvasPDF"
          style={{
            margin: "auto",
          }}
          ref={canvasEle}
        />
        {/* </Box> */}
        <Image w={"100%"} h={"100%"} visibility={"hidden"} id="temp" />
      <BtnGroup
        nowPage={nowPage}
        totalPages={totalPages}
        fitScreen={fitScreen}
        setPage={setPage}
        scale={scale}
      />
    </Box>
  );
};

export default PDF;
