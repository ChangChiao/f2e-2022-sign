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
const Side = () => {
  const { nextStep, prevStep } = useStep();
  const navigate = useNavigate();
  const { canvas } = useCanvas();
  const signImgRef = useRef<HTMLImageElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenCxt, onOpen: onOpenCxt, onClose: onCloseCxt } = useDisclosure();
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

  const getSign = () => {
    const sign = localStorage.getItem("sign_img");
    signImgRef.current!.src = sign ?? "";
    signOnCanvas();
    onClose();
  };

  return (
    <Box w={"400px"} h="calc(100vh - 200px)" p={4}>
      <Text textStyle={"label"} pb={2}>
        我的簽名
      </Text>
      <Image
        w={"300px"}
        h={"100px"}
        my={"14px"}
        mx={"auto"}
        border={"2px"}
        borderColor={"gray.300"}
        className=""
        ref={signImgRef}
      />
      <Button mb={2} w={"full"} variant={"outline"} onClick={onOpen}>
        <Add width={"30px"} />
        <Text pl={2}> 加入簽名</Text>
      </Button>
      <Button mb={2} w={"full"} variant={"outline"} onClick={onOpenCxt}>
        <Edit width={"30px"} />
        <Text pl={2}> 加入文字</Text>
      </Button>

      <Button mb={2} w={"full"} variant={"outline"}>
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
        <Sign getSign={getSign} />
      </ModalBox>
      <ModalBox isOpen={isOpenCxt} onClose={onCloseCxt}>
        <Content />
      </ModalBox>
    </Box>
  );
};

export default Side;
