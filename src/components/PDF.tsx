import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { fabric } from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import { useFile } from "@/provider/FileProvider";
import { Flex, Box, Image } from "@chakra-ui/react";
import { useCanvas } from "../provider/CanvasProvider";
import BtnGroup from "@/components/BtnGroup";
import PDFItem from "@/components/PDFItem";
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

  const getPDFPages = async () => {
    const docFile = getFile();
    let pdfData = "";
    pdfData = (await readBlob(docFile?.current!)) as string;
    //將 base64 中的前綴刪去，並進行解碼
    const data = window.atob(pdfData.substring(Base64Prefix.length));

    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
    setTotalPages(pdfDoc.numPages);
  }

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
    canvas.current![nowPage].setZoom(multiple);
  };

  const fitScreen = () => {
    const wrapperHeight = pdfWrapper.current!.clientHeight;
    const canvasHeiight = canvasEle.current!.clientHeight;
    const rate = Number((wrapperHeight / canvasHeiight).toFixed(2));
    console.log("rate", rate);

    canvas.current![nowPage].setZoom(rate);
  };

  const setPage = (type: string) => {
    let page = nowPage;
    if (type === "plus") {
      page += 1;
    } else {
      page -= 1;
    }
    page = range(page, totalPages, 1);
    setNowPage(page);
  };


  useEffect(() => {
    console.log('canvas.current', canvas.current)
    getPDFPages();
  }, []);


  return (
    <Box
      flex="1"
      alignItems={'center'}
      w={{ base: "90%", lg: "auto" }}
      overflowY={"scroll"}
      overflowX={{ base: "scroll", lg: "hidden" }}
      position={"relative"}
      backgroundColor={"gray.200"}
      mx={'auto'}
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
      {
        Array.from({length: totalPages}).map((item, i) => {
          return <PDFItem key={i} order={i} />
        })
      }
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
