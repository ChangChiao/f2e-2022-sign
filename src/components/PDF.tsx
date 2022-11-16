import React, { useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { fabric } from "fabric";
import { Canvas } from "fabric/fabric-impl";
import * as pdfjsLib from "pdfjs-dist";
import { useFile } from "../components/FileProvider";
import { Button, Flex, Box } from "@chakra-ui/react";
// @ts-ignore
const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
const Base64Prefix = "data:application/pdf;base64,";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.0.279/build/pdf.worker.min.js";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const pdf = new jsPDF();
let canvas: Canvas | null = null;
let multiple = 0;

function PDF() {
  const { file } = useFile();
  const canvasEle = useRef<HTMLCanvasElement>(null);
  function readBlob(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", reject);
      reader.readAsDataURL(blob);
    });
  }

  async function printPDF(paramPDF: File): Promise<HTMLCanvasElement | null> {
    // 將檔案處理成 base64
    let pdfData = "";
    pdfData = (await readBlob(paramPDF)) as string;
    console.log("pdfData===readBlob", pdfData);
    // 將 base64 中的前綴刪去，並進行解碼
    const data = window.atob(pdfData.substring(Base64Prefix.length));

    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
    console.log("pdfDoc", pdfDoc);

    const pdfPage = await pdfDoc.getPage(1);

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
  }

  async function pdfToImage(pdfData: HTMLCanvasElement) {
    // 設定 PDF 轉為圖片時的比例
    const scale = 1 / window.devicePixelRatio;
    console.log("pdfData-87777", pdfData);
    // 回傳圖片
    return new fabric.Image(pdfData, {
      // @ts-ignore
      id: "renderPDF",
      scaleX: scale,
      scaleY: scale,
    });
  }

  // 此處 canvas 套用 fabric.js

  async function handlePDFupload(e: React.ChangeEvent<HTMLInputElement>) {
    canvas!.requestRenderAll();
    if (!e.target.files) return;
    console.log("e.target.files[0]", e.target.files[0]);

    const pdfData = await printPDF(e.target.files[0]);
    console.log("pdfData-is", pdfData instanceof fabric.Canvas);

    const pdfImage = await pdfToImage(pdfData!);
    console.log("pdfImage-is", pdfImage instanceof fabric.Image);
    console.log("pdfImage", pdfImage);
    // 透過比例設定 canvas 尺寸
    canvas!.setWidth(pdfImage.width! / window.devicePixelRatio);
    canvas!.setHeight(pdfImage.height! / window.devicePixelRatio);

    // 將 PDF 畫面設定為背景
    console.log("canvas222", canvas);
    canvas!.setBackgroundImage(pdfImage, canvas!.renderAll.bind(canvas));
  }

  function imgOnCanvas() {
    const img = localStorage.getItem("sign_img");
    if (!img) return;
    console.log("imgOnCanvas");

    fabric.Image.fromURL(img, function (image) {
      // 設定簽名出現的位置及大小，後續可調整
      image.top = 400;
      image.scaleX = 0.5;
      image.scaleY = 0.5;
      canvas!.add(image);
    });
    console.log("imgOnCanvas");
  }

  function downloadPDF() {
    const image = canvas!.toDataURL({ format: "image/png" });

    const width = pdf.internal.pageSize.width;
    const height = pdf.internal.pageSize.height;
    pdf.addImage(image, "png", 0, 0, width, height);

    pdf.save("download.pdf");
  }

  function scale(type: string) {
    if (type === "plus") {
      multiple += 0.1;
    } else {
      multiple -= 0.1;
    }
    canvas!.setZoom(multiple);
    // canvas!.setWidth(originalWidth * canvas!.getZoom());
    // canvas!.setHeight(originalHeight * canvas!.getZoom());
  }

  useEffect(() => {
    canvas = new fabric.Canvas("canvasPDF", {
      fill: "#000",
      width: 300,
      height: 500,
      selectionLineWidth: 2,
      selectionColor: "blue",
    });
    console.log('file', file)
  }, []);

  return (
    <Flex>
      <Button onClick={downloadPDF} variant={"base"}>
        download
      </Button>
      <Button onClick={imgOnCanvas} variant={"base"}>
        add Sign
      </Button>
      <Button onClick={() => scale("plus")} variant={"base"}>
        放大
      </Button>
      <Button onClick={() => scale("minus")} variant={"base"}>
        縮小
      </Button>
      {/* <button onClick={downloadPDF}>download</button>
      <button onClick={imgOnCanvas}>add Sign</button> */}
      <input onChange={handlePDFupload} type="file" placeholder="選擇PDF檔案" />
      <Box border={"2px"}>
        <canvas id="canvasPDF" ref={canvasEle} />
      </Box>
      <Box textStyle="h1">This is a box</Box>
    </Flex>
  );
}

export default PDF;
