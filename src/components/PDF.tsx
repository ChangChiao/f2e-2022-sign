import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { fabric } from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import { useFile } from "@/components/FileProvider";
import { Flex, Box, Image } from "@chakra-ui/react";
import { useCanvas } from "./CanvasProvider";
import BtnGroup from "@/components/BtnGroup";
import { base64ToFile } from "@/utils/converFile";
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
    setSequence,
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
    isFromSequence?: boolean
  ): Promise<HTMLCanvasElement | null> => {
    // 將檔案處理成 base64
    let pdfData = "";
    pdfData = (await readBlob(paramPDF)) as string;
    console.log("pdfData===readBlob", pdfData);
    // 將 base64 中的前綴刪去，並進行解碼
    const data = window.atob(pdfData.substring(Base64Prefix.length));

    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
    console.log("pdfDoc", pdfDoc);

    const pdfPage = await pdfDoc.getPage(isFromSequence ? 1 : nowPage);
    console.warn("page", isFromSequence ? 1 : nowPage);
    if (totalPages === 0) {
      setTotalPages(pdfDoc.numPages);
    }
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

  const handleCanvasWidth = (pdfImage: fabric.Image) => {
    // 透過比例設定 canvas 尺寸
    console.log("pdfImage!!!", pdfImage);

    console.log("pdfImage.width", pdfImage.width);
    canvas.current!.setWidth(pdfImage.width! / window.devicePixelRatio);
    canvas.current!.setHeight(pdfImage.height! / window.devicePixelRatio);

    canvas.current!.setBackgroundImage(
      pdfImage,
      canvas.current!.renderAll.bind(canvas.current)
    );
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

  const handlePDFInit = async (fileParam: File, isFromSequence?: boolean) => {
    console.warn("fileParam", fileParam);

    canvas.current!.requestRenderAll();
    if (!fileParam) return;
    console.log("e.target.files[0]", fileParam);

    const pdfData = await genPDFCanvas(fileParam!, isFromSequence);

    const pdfImage = await pdfToImage(pdfData!);
    console.log("pdfImage", pdfImage);
    handleCanvasWidth(pdfImage);
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
    console.log("setPage", type);

    let page = nowPage;
    if (type === "plus") {
      page += 1;
    } else {
      page -= 1;
    }
    page = range(page, totalPages, 1);
    // if(initFlag.current){
    console.log("sequence== init----");
    saveSequence();
    // }
    setNowPage(page);
    // canvas.current?.remove();
  };

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    if (sequence[nowPage - 1]) {
      canvas.current.clear();
      getFromSequence();
    } else {
      const docFile = getFile();
      handlePDFInit(docFile?.current!);
    }

    setTimeout(() => {
      console.warn("sequence==", sequence);
      console.warn("sequence== .length", sequence.length);
      console.warn("sequence== index", nowPage - 1);
    }, 1000);

    initFlag.current = true;
  }, [nowPage]);

  useEffect(() => {
    const fabricObject = new fabric.Canvas("canvasPDF", {
      // width: pdfWrapper.current?.clientWidth,
      // height: pdfWrapper.current?.clientHeight,
    });
    console.log(
      "pdfWrapper.current?.clientWidth",
      pdfWrapper.current?.clientWidth
    );

    setCanvas(fabricObject);
    const canvasEle = document.getElementById("canvasPDF");
    canvasEle!.style.width = `${pdfWrapper.current?.clientWidth}px`;
    canvasEle!.style.height = `${pdfWrapper.current?.clientHeight}px`;
    console.log("file", file);
    // handlePDFInit();
  }, []);

  return (
    <Box flex="1" position={"relative"} backgroundColor={"gray.200"}>
      <Flex
        ref={pdfWrapper}
        overflow={"hidden"}
        mx="auto"
        justifyContent={"center"}
        // border="1px"
        w={{base:'100%', lg:"80%"}}
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
        <Image w={"100%"} h={"100%"} visibility={"hidden"} id="temp" />
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
