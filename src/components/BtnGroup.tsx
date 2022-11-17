import React from "react";
import { Box, Flex, HStack } from "@chakra-ui/react";
import { ReactComponent as One } from "../assets/icon/one.svg";
import { ReactComponent as Add } from "../assets/icon/Add.svg";
import { ReactComponent as FitScreen } from "../assets/icon/FitScreen.svg";
import { ReactComponent as FullScreen } from "../assets/icon/FullScreen.svg";
import { ReactComponent as Remove } from "../assets/icon/Remove.svg";
import { ReactComponent as Rotate90 } from "../assets/icon/Rotate90.svg";
import { ReactComponent as ArrowLeft } from "../assets/icon/ArrowLeft.svg";
import { ReactComponent as ArrowRight } from "../assets/icon/ArrowRight.svg";

type BtnGroupProps = {
    scale: (oaram: string) => void;
}

function BtnGroup({scale}: BtnGroupProps) {
  return (
    <Flex align={"center"} position={'absolute'} bottom="0" left={0}>
      <HStack spacing="4px" mr="10px">
        <Box layerStyle={"iconBox"}>
          <FitScreen width={"30px"} />
        </Box>
        <Box layerStyle={"iconBox"}>
          <FullScreen width={"30px"} />
        </Box>
        <Box layerStyle={"iconBox"}>
          <One width={"30px"} />
        </Box>
      </HStack>
      <HStack spacing="4px" mr="10px">
        <Box layerStyle={"iconBox"}>
          <Add onClick={()=>scale('plus')} width={"30px"} />
        </Box>
        <Box layerStyle={"iconBox"}>
          <Remove onClick={()=>scale('minus')} width={"30px"} />
        </Box>
      </HStack>
      <HStack spacing="4px" mr="10px">
        <Box layerStyle={"iconBox"}>
          <ArrowLeft width={"30px"} />
        </Box>
        <Box layerStyle={"iconBox"}>
          <ArrowRight width={"30px"} />
        </Box>
      </HStack>
      <Box layerStyle={"iconBox"}>
        <Rotate90 width={"30px"} />
      </Box>
    </Flex>
  );
}

export default BtnGroup;
