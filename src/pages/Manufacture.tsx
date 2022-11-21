import Steps from "@/components/common/Steps";
import Side from "@/components/common/Side";
import PDF from "@/components/PDF";
import { Box, Flex } from "@chakra-ui/react";
function Manufacture() {
  return (
    <Box>
      <Steps />
      <Flex position={'relative'} boxSize='border-box' h="calc(100vh - 200px)" overflow={'hidden'} borderTop={"1px solid"} borderColor={"gray.300"}>
        <Box
          display={{ base: "none", lg: "block" }}
          w={"72px"}
          h={"100%"}
        ></Box>
        <PDF />
        <Side />
      </Flex>
    </Box>
  );
}

export default Manufacture;
