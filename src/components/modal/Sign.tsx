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
  useMediaQuery,
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const signImgRef = useRef<HTMLImageElement>(null);
  const isPainting = useRef(false);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const canvasSize = useRef<DOMRect | null>(null);
  const [strokeColor, serStrokeColor] = useState('black');
  const history = useRef<HTMLImageElement[]>([]);
  const strokeList = ["black", "blue", "red"];

  const [isLargerThanPad] = useMediaQuery("(min-width: 1024px)");
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

  type Event =
    | React.MouseEvent<HTMLCanvasElement>
    | React.TouchEvent<HTMLCanvasElement>;

  const getPaintPosition = (e: Event) => {
    const scaleX = canvasRef.current!.width / canvasSize.current!.width;
    const scaleY = canvasRef.current!.height / canvasSize.current!.height;
    if (e.nativeEvent instanceof MouseEvent) {
      return {
        x:
          ((e as React.MouseEvent<HTMLCanvasElement>).clientX -
            canvasSize.current!.left) *
          scaleX,
        y:
          ((e as React.MouseEvent<HTMLCanvasElement>).clientY -
            canvasSize.current!.top) *
          scaleY,
      };
    } else {
      return {
        x:
          ((e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientX -
            canvasSize.current!.left) *
          scaleX,
        y:
          ((e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientY -
            canvasSize.current!.top) *
          scaleY,
      };
    }
  };

  const startPosition = (e: Event) => {
    e.preventDefault();
    isPainting.current = true;
  };

  const finishedPosition = () => {
    if(!isPainting.current) return;
    isPainting.current = false;
    // console.log("context", context);
    context.current!.beginPath();
    addHistory();
  };

  const draw = (e: Event) => {
    if (!isPainting.current) return;

    const paintPosition = getPaintPosition(e);
    console.log("context-988", context);

    context.current!.lineTo(paintPosition.x, paintPosition.y);
    context.current!.stroke();
  };

  // 重新設定畫布
  const reset = () => {
    context.current!.clearRect(
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

  const undo = () => {
    console.log('undo');
    
    reset();
    const temp = [...history.current];
    temp.splice(temp.length - 1, 1);
    const latest =  temp[temp.length - 1]
    console.log('addHistory -latest', latest);
    console.log('addHistory -temp', temp);
    history.current = temp
    if (!latest) {
      return
    }
    
    context.current!.drawImage(latest, 0, 0)
  }

  const saveUploadImage = () => {
    const newImage = window.URL.createObjectURL(signFile.current!);
    localStorage.setItem("sign_img", newImage);
    setSign();
  };

  const changStrokeColor = (color: string) => {
    context.current!.strokeStyle = color;
    serStrokeColor(color)
  };

  const addHistory = () => {    
    console.log("addHistory");
    
      const dataUrl = canvasRef.current!.toDataURL()
      const img = document.createElement('img')
      img.src = dataUrl
      history.current =  [...history.current, img]
   }


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
    canvasSize.current! = canvasRef.current!.getBoundingClientRect()
    // setCanvasSize(canvasRef.current!.getBoundingClientRect());
    if (ctx) {
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
    }
    context.current = ctx;
    console.log('render!!!!');
    
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
          <Flex
            flexDirection={"column"}
            align={"center"}
            justify={"between"}
            className="flex items-center justify-between"
          >
            <Box border={"1px"} p={2} borderColor={"gray.200"}>
              <Text cursor={'pointer'} onClick={undo} pb={2} textAlign={'right'} color={'primary.default'}>回上一步</Text>
              <canvas
                id="canvas"
                style={{ border: "1px solid #aaa" }}
                width={isLargerThanPad ? 400 : 300}
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
                    position={'relative'}
                    borderRadius={"50%"}
                    bg={color}
                    _before={{
                      content: `""`,
                      position: "absolute",
                      width: "24px",
                      height: "24px",
                      border: "2px solid",
                      borderRadius: "50%",
                      borderColor: color,
                      left: "-4px",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      margin: "auto",
                      display: color === strokeColor ? "block" : "none",
                    }}
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
