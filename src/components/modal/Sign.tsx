import React, { useCallback, memo, useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  Image,
  Button,
  Flex,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { checkFileSize, checkImageType } from "../../utils/checkFile";
import { useDropzone } from "react-dropzone";

type SignProps = {
  setSign: () => void;
  setContent: (content: string, fontFamily?: string) => void;
};

type NameData = {
  name: string;
};

enum FontList {
  "Noto Sans TC",
  "Noto Serif TC",
}

const Sign = ({ setSign, setContent }: SignProps) => {
  const signImgRef = useRef<HTMLImageElement>(null);
  const [showSign, setShowSign] = useState(false);
  const [font, setFont] = useState(0);
  let signFile = useRef<File | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<NameData>();

  const onDrop = useCallback((acceptedFiles: unknown) => {
    console.log("acceptedFiles", acceptedFiles);
    const file = acceptedFiles as File[];
    if (!checkFileSize(file[0]) || !checkImageType(file[0])) return;
    signFile.current = file[0];
    setShowSign(true);
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
    console.log("context", context);

    context!.beginPath();
  };

  const draw = (e: Event) => {
    if (!isPainting.current) return;

    const paintPosition = getPaintPosition(e);
    console.log("context-988", context);

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
    localStorage.setItem("sign_img", newImage);
    console.log("saveImage", newImage);

    setSign();
  };

  const saveUploadImage = () => {
    const newImage = window.URL.createObjectURL(signFile.current!);

    localStorage.setItem("sign_img", newImage);
    setSign();
  };

  const changStrokeColor = (color: string) => {
    context!.strokeStyle = color;
  };

  const onSubmit = (data: NameData) => {
    setContent(data.name, FontList[font]);
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
        <Tab w={"30%"}>手寫</Tab>
        <Tab w={"30%"}>輸入</Tab>
        <Tab w={"30%"}>上傳</Tab>
      </TabList>

      <TabPanels>
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
                  onClick={reset}
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
          <Box mb={4}>
            <Button
              onClick={() => setFont(0)}
              variant={font === 0 ? "outline_active" : "outline"}
              mr={2}
            >
              思源黑體
            </Button>
            <Button
              onClick={() => setFont(1)}
              variant={font === 1 ? "outline_active" : "outline"}
            >
              思源宋體
            </Button>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mt={2} isInvalid={Boolean(errors.name)}>
              <FormLabel fontWeight={"bold"} htmlFor="content">
                輸入姓名
              </FormLabel>
              <Input
                id="content"
                fontFamily={FontList[font]}
                fontSize={22}
                placeholder="請輸入姓名"
                {...register("name", {
                  required: "內容不得為空",
                })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message?.toString()}
              </FormErrorMessage>
              <Box textAlign={"center"}>
                <Button
                  mt={10}
                  mx={"auto"}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  新增
                </Button>
              </Box>
            </FormControl>
          </form>
        </TabPanel>
        <TabPanel>
          <Flex flexDir={"column"} p={4}>
            {!showSign ? (
              <Flex
                {...getRootProps()}
                justifyContent={"center"}
                flexDir={"column"}
              >
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
                <Box
                  border="1px"
                  borderColor={"gray.200"}
                  h={"300px"}
                  overflowY={"auto"}
                >
                  <Image
                    objectFit={"contain"}
                    maxW={"100%"}
                    ref={signImgRef}
                    src=""
                    alt=""
                  />
                </Box>
                <Button onClick={saveUploadImage} mt={2}>
                  儲存
                </Button>
              </Flex>
            )}
          </Flex>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default memo(Sign);
