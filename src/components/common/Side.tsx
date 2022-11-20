import { useRef, useCallback } from "react";
import { fabric } from "fabric";
import { ReactComponent as Add } from "@/assets/icon/Add.svg";
import { ReactComponent as Edit } from "@/assets/icon/Edit.svg";
import { ReactComponent as CalendarToday } from "@/assets/icon/CalendarToday.svg";
import { useStep } from "@/components/StepProvider";
import { useCanvas } from "@/components/CanvasProvider";
import { ReactComponent as ArrowLeft } from "@/assets/icon/ArrowLeft.svg";
import { ReactComponent as ArrowRight } from "@/assets/icon/ArrowRight.svg";
import {
  Box,
  Image,
  Flex,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ModalBox from "@/components/modal/ModalBox";
import Sign from "@/components/modal/Sign";
import Content from "@/components/modal/Content";
import DateSelect from "@/components/modal/DateSelect";
import { useFile } from "@/components/FileProvider";
import { useState } from "react";
const Side = () => {
  const { nextStep, prevStep, activeStep } = useStep();
  const { saveSequence } = useFile();
  const navigate = useNavigate();
  const { canvas } = useCanvas();
  const signImgRef = useRef<HTMLImageElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpenMenu, toggleMenu] = useState(false);
  const {
    isOpen: isOpenCxt,
    onOpen: onOpenCxt,
    onClose: onCloseCxt,
  } = useDisclosure();
  const {
    isOpen: isOpenDate,
    onOpen: onOpenDate,
    onClose: onCloseDate,
  } = useDisclosure();
  const goPrevPage = () => {
    prevStep();
    navigate("/");
  };

  const goNextPage = () => {
    nextStep();
    saveSequence();
  };

  const signOnCanvas = () => {
    const img = localStorage.getItem("sign_img");
    if (!img) return;
    fabric.Image.fromURL(img, function (image) {
      image.top = 400;
      image.scaleX = 0.5;
      image.scaleY = 0.5;
      canvas.current!.add(image);
    });
  };

  const setSign = useCallback(() => {
    signOnCanvas();
    onClose();
  }, []);

  const contentOnCanvas = (content: string, fontFamily = "Noto Sans TC") => {
    console.log("content", content);

    const text = new fabric.Text(content, {
      top: 400,
      fill: "black",
      fontFamily,
    });
    canvas.current!.add(text);
  };

  const setContent = useCallback((content: string, fontFamily?: string) => {
    contentOnCanvas(content, fontFamily);
    onClose();
    onCloseCxt();
    onCloseDate();
  }, []);

  return (
    <Box
      position={{ base: "absolute", lg: "relative" }}
      bgColor={"#fff"}
      w={{ base: "95%", lg: "400px" }}
      h="calc(100vh - 200px)"
      transitionDuration={"0.5s"}
      transform={isOpenMenu ? "translateX(5%)" : "translateX(95%)"}
      boxShadow={"-2px 0px 5px 2px rgba(0,0,0,.2)"}
      pl={{ base: "60px", lg: "0" }}
    >
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        position={"absolute"}
        left={0}
        display={{ base: "flex", lg: "none" }}
        h={"full"}
        boxShadow={"4px 0px 5px rgba(0, 0, 0,.2)"}
        onClick={() => toggleMenu(!isOpenMenu)}
      >
        {isOpenMenu ? <ArrowLeft /> : <ArrowRight />}
      </Flex>
      <Button mt={4} mb={2} w={"full"} variant={"outline"} onClick={onOpen}>
        <Add width={"30px"} />
        <Text pl={2}> 加入簽名</Text>
      </Button>
      <Button mb={2} w={"full"} variant={"outline"} onClick={onOpenCxt}>
        <Edit width={"30px"} />
        <Text pl={2}> 加入文字</Text>
      </Button>

      <Button mb={2} w={"full"} variant={"outline"} onClick={onOpenDate}>
        <CalendarToday width={"30px"} />
        <Text pl={2}> 加入日期</Text>
      </Button>
      <Box mt={4}>
        <Button mb={2} onClick={goNextPage} w={"full"}>
          下一步
        </Button>
        <Button
          onClick={goPrevPage}
          w={"full"}
          color={"gray.400"}
          bgColor={"gray.200"}
          variant={"outline"}
        >
          上一步
        </Button>
      </Box>
      {activeStep === 2 && (
        <Flex
          position={"absolute"}
          top={0}
          left={0}
          w={"full"}
          h={"full"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box
            position={"absolute"}
            bgColor={"rgba(11, 125, 119, 0.1)"}
            w={"full"}
            h={"full"}
            backdropFilter="auto"
            backdropBlur="6px"
          ></Box>
          <Box
            position={"relative"}
            zIndex={10}
            bgColor={"#fff"}
            w={"80%"}
            p={8}
            borderRadius={"6px"}
            bg={""}
            textAlign={"center"}
          >
            <Text pb={2} color={"primary.default"} textStyle={"h2"}>
              請確認您的檔案
            </Text>
            <Text pb={4} color={"gray.500"}>
              確認後將無法修改
            </Text>
            <Button
              w={"full"}
              mb={2}
              variant={"solid"}
              onClick={() => navigate("/finish")}
            >
              確認
            </Button>
            <Button w={"full"} variant={"outline"} onClick={() => prevStep()}>
              返回
            </Button>
          </Box>
        </Flex>
      )}
      <ModalBox isOpen={isOpen} onClose={onClose}>
        <Sign setContent={setContent} setSign={setSign} />
      </ModalBox>
      <ModalBox isOpen={isOpenCxt} onClose={onCloseCxt}>
        <Content setContent={setContent} />
      </ModalBox>
      <ModalBox isOpen={isOpenDate} onClose={onCloseDate}>
        <DateSelect setContent={setContent} />
      </ModalBox>
    </Box>
  );
};

export default Side;
