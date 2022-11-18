import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import { useFile } from "../components/FileProvider";
import { Flex, Box } from "@chakra-ui/react";
import { useCanvas } from "./CanvasProvider";
import BtnGroup from "../components/BtnGroup";
// @ts-ignore
const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
const Base64Prefix = "data:application/pdf;base64,";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://mozilla.github.io/pdf.js/build/pdf.worker.js";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// let canvas: Canvas | null = null;
let multiple = 1;

const PDF = () => {
  const { file, getFile } = useFile();
  const { canvas, setCanvas } = useCanvas()
  const canvasEle = useRef<HTMLCanvasElement>(null);
  const pdfWrapper = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [nowPage, setNowPage] = useState(1);
  const readBlob = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", reject);
      reader.readAsDataURL(blob);
    });
  };

  const genPDFCanvas = async (
    paramPDF: File
  ): Promise<HTMLCanvasElement | null> => {
    // 將檔案處理成 base64
    let pdfData = "";
    pdfData = (await readBlob(paramPDF)) as string;
    console.log("pdfData===readBlob", pdfData);
    // 將 base64 中的前綴刪去，並進行解碼
    const data = window.atob(pdfData.substring(Base64Prefix.length));

    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
    console.log("pdfDoc", pdfDoc);

    const pdfPage = await pdfDoc.getPage(nowPage);
    console.log("page", nowPage);
    setTotalPages(pdfDoc.numPages);
    console.log("pdfDoc.numPages", pdfDoc.numPages);

    // create canvas
    const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
    console.log("viewport", viewport);

    const newCanvas = document.createElement("canvas");
    const context = newCanvas.getContext("2d");
    console.warn("context", context);

    newCanvas.height = viewport.height;
    newCanvas.width = viewport.width;
    const renderContext = {
      canvasContext: context!,
      viewport,
    };
    console.warn("renderContext", renderContext);
    console.warn("pdfPage", pdfPage);
    const renderTask = pdfPage.render(renderContext);
    console.warn("renderTask", renderTask);
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

  // 此處 canvas 套用 fabric.js

  const handlePDFInit = async () => {
    canvas.current!.requestRenderAll();
    const docFile = getFile()
    if (!docFile?.current) return;
    console.log("e.target.files[0]", docFile.current);

    const pdfData = await genPDFCanvas(docFile.current!);
    console.log("pdfData-is", pdfData instanceof fabric.Canvas);

    const pdfImage = await pdfToImage(pdfData!);
    console.log("pdfImage-is", pdfImage instanceof fabric.Image);
    console.log("pdfImage", pdfImage);
    // 透過比例設定 canvas 尺寸
    canvas.current!.setWidth(pdfImage.width! / window.devicePixelRatio);
    canvas.current!.setHeight(pdfImage.height! / window.devicePixelRatio);

    canvas.current!.setBackgroundImage(pdfImage, canvas.current!.renderAll.bind(canvas.current));
  };


  const range = (number: number, max: number, min: number) => {
    return Math.max(0.1, Math.min(number, 2));
  };

  const scale = (type: string) => {
    if (type === "plus") {
      multiple += 0.1;
    } else {
      multiple -= 0.1;
    }
    multiple = range(multiple, 2, 1);
    canvas.current!.setZoom(multiple);
    // canvas!.setWidth(originalWidth * canvas!.getZoom());
    // canvas!.setHeight(originalHeight * canvas!.getZoom());
  };

  const fitScreen = () => {
    const wrapperHeight = pdfWrapper.current!.clientHeight;
    const canvasHeiight = canvasEle.current!.clientHeight;
    const rate = Number((wrapperHeight / canvasHeiight).toFixed(2));
    console.log("rate", rate);

    canvas.current!.setZoom(rate);
  };

  const setPage = (type: string) => {
    let page = totalPages;
    if (type === "plus") {
      page += 1;
    } else {
      page -= 1;
    }
    page = range(page, totalPages, 1);
    setNowPage(page);
  };

  const signOnCanvas = () => {
    const img = localStorage.getItem("sign_img");
    if (!img) return;
    console.log("imgOnCanvas");

    fabric.Image.fromURL(img, function (image) {
      image.top = 500;
      image.scaleX = 0.5;
      image.scaleY = 0.5;
      canvas.current!.add(image);
      canvas.current!.renderAll();
    });
  };

  // useEffect(() => {
  //   if(!canvas.current){
  //     return;
  //   }
  //   handlePDFInit();
  // }, [nowPage]);

  useEffect(() => {
    const fabricObject = new fabric.Canvas("canvasPDF", {
      // width: pdfWrapper.current?.clientWidth,
      // height: pdfWrapper.current?.clientHeight,
    });
    console.log('pdfWrapper.current?.clientWidth', pdfWrapper.current?.clientWidth);
    
    setCanvas(fabricObject);
    // canvas.current!.setHeight(pdfWrapper.current!.clientHeight);
    // canvas.current!.setWidth(pdfWrapper.current!.clientWidth);
    const canvasEle = document.getElementById('canvasPDF');
    canvasEle!.style.width = `${pdfWrapper.current?.clientWidth}px`;
    canvasEle!.style.height = `${pdfWrapper.current?.clientHeight}px`;
    console.log("file", file);
    handlePDFInit();
  }, []);

  return (
    <Box flex="1" position={"relative"} backgroundColor={"gray.200"}>
      <Flex
        ref={pdfWrapper}
        overflow={"hidden"}
        mx="auto"
        justifyContent={"center"}
        // border="1px"
        w={"80%"}
        h={"100%"}
      >
        <canvas
          id="canvasPDF"
          style={{
            margin: "auto",
          }}
          ref={canvasEle}
        />
        {/* </Box> */}
        <BtnGroup
          nowPage={nowPage}
          totalPages={totalPages}
          fitScreen={fitScreen}
          setPage={setPage}
          scale={scale}
        />
      </Flex>
    </Box>
  );
};

export default PDF;
