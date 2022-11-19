import { useRef } from "react";
import { fabric } from "fabric";
import { ReactComponent as Add } from "@/assets/icon/Add.svg";
import { ReactComponent as Edit } from "@/assets/icon/Edit.svg";
import { ReactComponent as CalendarToday } from "@/assets/icon/CalendarToday.svg";
import { useStep } from "@/components/StepProvider";
import { useCanvas } from "@/components/CanvasProvider";
import { Box, Image, Button, Text, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ModalBox from "@/components/modal/ModalBox";
import Sign from "@/components/modal/Sign";
import Content from "@/components/modal/Content";
import DateSelect from "@/components/modal/DateSelect";
const Side = () => {
  const { nextStep, prevStep } = useStep();
  const navigate = useNavigate();
  const { canvas } = useCanvas();
  const signImgRef = useRef<HTMLImageElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    navigate("/finish");
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

  const setSign = () => {
    signOnCanvas();
    onClose();
  };

  const contentOnCanvas = (content: string, fontFamily = "Noto Sans TC") => {
    console.log('content', content);
    
    const text = new fabric.Text(content, {
      top: 400,
      fill: "black",
      fontFamily
    });
    canvas.current!.add(text);
  };

  const setContent = (content: string, fontFamily?: string) => {
    contentOnCanvas(content, fontFamily);
      onClose();
      onCloseCxt();
      onCloseDate();
    
  };

  return (
    <Box w={"400px"} h="calc(100vh - 200px)" p={4}>
      <Button mb={2} w={"full"} variant={"outline"} onClick={onOpen}>
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
      <Button
        mb={2}
        onClick={goPrevPage}
        w={"full"}
        color={"gray.400"}
        bgColor={"gray.200"}
        variant={"outline"}
      >
        上一步
      </Button>
      <Box>
        <Button onClick={goNextPage} w={"full"}>
          {" "}
          下一步
        </Button>
      </Box>
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
