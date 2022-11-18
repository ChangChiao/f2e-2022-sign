import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  Image,
  Button,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { checkFileSize, checkImageType } from "../utils/checkFile";
import { useDropzone } from "react-dropzone";
type Props = {
  getSign: () => void;
};

const Sign = ({ getSign }: Props) => {
  const signImgRef = useRef<HTMLImageElement>(null);
  const [showSign, setShowSign] = useState(false);
  let signFile = useRef<File | null>(null);
  const onDrop = useCallback((acceptedFiles: unknown) => {
    console.log("acceptedFiles", acceptedFiles);
    const file = acceptedFiles as File[];
    if (!checkFileSize(file[0]) || !checkImageType(file[0])) return;
    signFile.current = file[0];
    setShowSign(true);
    console.log("trueeeee");
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const signImgRef = useRef<HTMLImageElement>(null);
  const isPainting = useRef(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [canvasSize, setCanvasSize] = useState<DOMRect | null>(null);
  const strokeList = ["red", "blue", "black"];
  type Event =
    | React.MouseEvent<HTMLCanvasElement>
    | React.TouchEvent<HTMLCanvasElement>;

  const getPaintPosition = (e: Event) => {
    const scaleX = canvasRef.current!.width / canvasSize!.width;
    const scaleY = canvasRef.current!.height / canvasSize!.height;
    if (e.nativeEvent instanceof MouseEvent) {
      return {
        x:
          ((e as React.MouseEvent<HTMLCanvasElement>).clientX -
            canvasSize!.left) *
          scaleX,
        y:
          ((e as React.MouseEvent<HTMLCanvasElement>).clientY -
            canvasSize!.top) *
          scaleY,
      };
    } else {
      return {
        x:
          ((e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientX -
            canvasSize!.left) *
          scaleX,
        y:
          ((e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientY -
            canvasSize!.top) *
          scaleY,
      };
    }
  };

  const startPosition = (e: Event) => {
    e.preventDefault();
    isPainting.current = true;
  };

  const finishedPosition = () => {
    isPainting.current = false;
    context!.beginPath();
  };

  const draw = (e: Event) => {
    if (!isPainting.current) return;

    const paintPosition = getPaintPosition(e);

    context!.lineTo(paintPosition.x, paintPosition.y);
    context!.stroke();
  };

  // 重新設定畫布
  const reset = () => {
    context!.clearRect(
      0,
      0,
      canvasRef.current!.width,
      canvasRef.current!.height
    );
  };

  const saveImage = () => {
    const newImage = canvasRef.current!.toDataURL("image/png");
    // signImgRef.current!.src = newImage;
    console.log('newImage--', newImage);
    console.log('newImage--', typeof(newImage));
    
    localStorage.setItem("sign_img", newImage);
    getSign();
  };

  const changStrokeColor = (color: string) => {
    context!.strokeStyle = color;
  };

  useEffect(() => {
    console.log("showSign", showSign, signFile);

    if (!showSign || !signFile.current) return;
    signImgRef.current!.src = window.URL.createObjectURL(signFile.current);
  }, [showSign]);

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
    <Tabs colorScheme={"green"}>
      <TabList>
        {/* <Tab w={'1/3'}>輸入</Tab> */}
        <Tab w={"30%"}>手寫</Tab>
        <Tab w={"30%"}>上傳</Tab>
      </TabList>

      <TabPanels>
        {/* <TabPanel>
      <p>one!</p>
    </TabPanel> */}
        <TabPanel>
          <Box>
            <Flex
              flexDirection={"column"}
              align={"center"}
              justify={"between"}
              className="flex items-center justify-between"
            >
              <Box border={"1px"} p={2} borderColor={"gray.200"}>
                <canvas
                  id="canvas"
                  style={{ border: "1px solid #aaa" }}
                  width={400}
                  height={200}
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
                <Flex
                  pt={2}
                  float={"right"}
                  w={"80px"}
                  justifyContent="space-between"
                >
                  {strokeList.map((color) => (
                    <Box
                      key={color}
                      w={4}
                      h={4}
                      borderRadius={"50%"}
                      bg={color}
                      onClick={() => changStrokeColor(color)}
                    ></Box>
                  ))}
                </Flex>
              </Box>
              <Text
                textAlign={"center"}
                py={4}
                fontSize={"sm"}
                color={"gray.400"}
              >
                我了解這是一個具法律效力的本人簽名
              </Text>
              <Flex dir="row">
                <Button
                  variant={"disable"}
                  mx={"auto"}
                  mr={"10px"}
                  onClick={saveImage}
                >
                  清除
                </Button>
                <Button mx={"auto"} onClick={saveImage}>
                  儲存
                </Button>
              </Flex>
            </Flex>
          </Box>
        </TabPanel>
        <TabPanel>
          <Flex
            {...getRootProps()}
            border="1px"
            flexDir={"column"}
            p={4}
            borderColor={"gray.200"}
          >
            {!showSign ? (
              <Flex justifyContent={"center"} flexDir={"column"}>
                <Button variant={"outline"}>上傳檔案</Button>
                <input {...getInputProps()} />
                <Text
                  textAlign={"center"}
                  pt="2"
                  as={"span"}
                  display={"block"}
                  color={"primary.default"}
                >
                  檔案大小10MB以內，檔案格式為JPG、PNG
                </Text>
              </Flex>
            ) : (
              <Flex direction={"column"}>
                <Image
                  objectFit={"contain"}
                  maxW={"100%"}
                  ref={signImgRef}
                  src=""
                  alt=""
                />
                <Button mt={2}>儲存</Button>
              </Flex>
            )}
          </Flex>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Sign;
