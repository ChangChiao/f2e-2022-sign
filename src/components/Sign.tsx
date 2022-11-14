import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Image,
  Button,
  Flex,
} from "@chakra-ui/react";
function Sign() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signImgRef = useRef<HTMLImageElement>(null);
  const isPainting = useRef(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [canvasSize, setCanvasSize] = useState<DOMRect | null>(null);

  type Event = React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>;

  function getPaintPosition(e: Event) {
    const scaleX = canvasRef.current!.width / canvasSize!.width;
    const scaleY = canvasRef.current!.height / canvasSize!.height;
    if (e.nativeEvent instanceof MouseEvent) {
      return {
        x: ((e as React.MouseEvent<HTMLCanvasElement>).clientX - canvasSize!.left) * scaleX,
        y: ((e as React.MouseEvent<HTMLCanvasElement>).clientY - canvasSize!.top) * scaleY,
      };
    } else {
      return {
        x: ((e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientX - canvasSize!.left) * scaleX,
        y: ((e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientY - canvasSize!.top) * scaleY,
      };
    }
  }


  function startPosition(e: Event) {
    e.preventDefault();
    isPainting.current = true;
  }

  function finishedPosition() {
    isPainting.current = false;
    context!.beginPath();
  }

  function draw(e : Event) {
    if (!isPainting.current) return;

    const paintPosition = getPaintPosition(e);

    context!.lineTo(paintPosition.x, paintPosition.y);
    context!.stroke();
  }


  // 重新設定畫布
  function reset() {
    context!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
  }

  function saveImage() {
    const newImage = canvasRef.current!.toDataURL("image/png");
    signImgRef.current!.src = newImage;
    localStorage.setItem("sign_img", newImage);
  }

  useEffect(() => {
    const ctx = canvasRef.current!.getContext("2d");
    setCanvasSize(canvasRef.current!.getBoundingClientRect());
    if (ctx) {
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
    }
    setContext(ctx);
  }, []);
  return (
    <Box border={"2px"} borderColor={"#ccc"}>
      <canvas
        className="h-[300px] w-[300px] border border-gray-800"
        id="canvas"
        style={{border: '1px solid #000000'}}
        width={300}
        height={300}
        onMouseDown={startPosition}
        onMouseUp={finishedPosition}
        onMouseLeave={finishedPosition}
        onMouseMove={draw}
        onTouchStart={startPosition}
        onTouchEnd={finishedPosition}
        onTouchCancel={finishedPosition}
        onTouchMove={draw}
        ref={canvasRef}
      ></canvas>
      <Image
        w={'200px'} h={'200px'} border={'2px'} borderColor={"#333"}
        className="h-[200px] w-[200px] border border-gray-800"
        ref={signImgRef}
      />
      <Flex align={'center'} justify={'between'} className="flex items-center justify-between">
        <Button variant={'base'} onClick={reset} className="clear">
          Clear
        </Button>
        <Button variant={'base'} className="save" onClick={saveImage}>
          Save
        </Button>
      </Flex>
    </Box>
  );
}

export default Sign;
