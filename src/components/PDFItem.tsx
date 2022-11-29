import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { fabric } from "fabric";
import { useCanvas } from "./CanvasProvider";
import { useFile } from "@/components/FileProvider";
import { Box, calc } from "@chakra-ui/react";
import * as pdfjsLib from "pdfjs-dist";

const pdf = new jsPDF();
// @ts-ignore
const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
const Base64Prefix = "data:application/pdf;base64,";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function PDFItem({ order }: { order: number }) {
  const canvasEle = useRef<HTMLCanvasElement>(null);
  const pdfWrapper = useRef<HTMLDivElement>(null);
  const { getFile, saveSequence, nowPage } = useFile();
  const { canvas, setCanvas } = useCanvas();

  const readBlob = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", reject);
      reader.readAsDataURL(blob);
    });
  };

  const initFabric = () => {
    const fabricObject = new fabric.Canvas(`canvasPDF_${order}`);
    console.log("fabricObject", fabricObject);

    setCanvas(fabricObject, order);
    // const canvasEle = document.getElementById("canvasPDF");
    console.warn("canvasEle", canvasEle);
    console.warn("pdfWrapper", pdfWrapper.current?.clientHeight);

    canvasEle.current!.style.width = `${pdfWrapper.current?.clientWidth}px`;
    canvasEle.current!.style.height = `${pdfWrapper.current?.clientHeight}px`;
  };

  const handleCanvasWidth = (pdfImage: fabric.Image) => {
    const target = canvas.current?.[order]
    console.warn("canvas.current", canvas.current);
    console.warn("pdfImage===", pdfImage);
    console.warn('devicePixelRatio', devicePixelRatio);
    
    // 透過比例設定 canvas 尺寸
    target!.setWidth(
      pdfImage.width! / window.devicePixelRatio
    );
    target!.setHeight(
      pdfImage.height! / window.devicePixelRatio
    );

    target!.setBackgroundImage(
      pdfImage,
      target!.renderAll.bind(target)
    );
  };

  const pdfToImage = async (pdfData: HTMLCanvasElement) => {
    // 設定 PDF 轉為圖片時的比例
    const scale = 1 / window.devicePixelRatio;
    // 回傳圖片
    return new fabric.Image(pdfData, {
      // @ts-ignore
      id: "renderPDF" + order,
      scaleX: scale,
      scaleY: scale,
    });
  };

  const genPDFCanvas = async (
    paramPDF: File
  ): Promise<HTMLCanvasElement | null> => {
    // 將檔案處理成 base64
    let pdfData = "";
    pdfData = (await readBlob(paramPDF)) as string;
    // 將 base64 中的前綴刪去，並進行解碼
    const data = window.atob(pdfData.substring(Base64Prefix.length));

    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
    console.warn("87777", order);

    const pdfPage = await pdfDoc.getPage(order + 1);

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

  const handlePDFInit = async (paramPDF: File) => {
    const target = canvas.current?.[order];
    if (target?.getObjects()) {
      target!.remove(...target!.getObjects());
    }
    target!.requestRenderAll();
    const pdfData = await genPDFCanvas(paramPDF!);
    const pdfImage = await pdfToImage(pdfData!);
    console.log("pdfData", pdfData);
    console.log("pdfImage", pdfImage);
    

    saveSequence(order, pdfData!);
    handleCanvasWidth(pdfImage);
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

    img.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMzhfMTQ2MjEpIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxXzMzMzhfMTQ2MjEpIj4KPHBhdGggZD0iTTggOEg0MFY0MEg4VjhaIiBmaWxsPSIjMEI3RDc3Ii8+CjxwYXRoIGQ9Ik0zMy4zMzM0IDI1LjMzMzJIMTQuNjY2N1YyMi42NjY1SDMzLjMzMzRWMjUuMzMzMloiIGZpbGw9IndoaXRlIi8+CjwvZz4KPHBhdGggZD0iTTM4IDEwVjM4SDEwVjEwSDM4Wk0zOCA2SDEwQzcuOCA2IDYgNy44IDYgMTBWMzhDNiA0MC4yIDcuOCA0MiAxMCA0MkgzOEM0MC4yIDQyIDQyIDQwLjIgNDIgMzhWMTBDNDIgNy44IDQwLjIgNiAzOCA2WiIgZmlsbD0iIzBCN0Q3NyIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMzhfMTQ2MjEiPgo8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMzOF8xNDYyMSI+CjxyZWN0IHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDggOCkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K";
    const size = 30;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  };

  const deleteObject = (eventData: MouseEvent, transform: fabric.Transform) => {
    const target = transform.target;
    const objCanvas = target.canvas;
    objCanvas!.remove(target);
    objCanvas!.requestRenderAll();
    return true;
  };
  useEffect(() => {
    initFabric();
    addDeleteBtn();
    const docFile = getFile();
    handlePDFInit(docFile?.current!);
  }, []);

  useEffect(()=>{
    console.warn("xxxxxxx", canvas.current);
    
  }, [canvas.current])

  return (
    <Box
      height="calc(100vh - 152px)"
      mb={"100px"}
      position={'relative'}
      ref={pdfWrapper}
    //   w={{ base: "100%", lg: "auto" }}
    >
      <canvas
        id={"canvasPDF_" + order}
        style={{
          margin: "auto",
        }}
        ref={canvasEle}
      />
    </Box>
  );
}

export default PDFItem;
