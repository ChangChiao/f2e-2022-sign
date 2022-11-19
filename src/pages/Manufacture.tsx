import Steps from "@/components/common/Steps";
import Side from "@/components/common/Side";
import PDF from "@/components/PDF";
import { Box, Flex } from "@chakra-ui/react";
function Manufacture() {
  return (
    <Box>
      <Steps />
      <Flex borderTop={"1px solid"} borderColor={"gray.300"}>
        <Box w={"72px"} h={"100%"}></Box>
        <PDF />
        <Side />
      </Flex>
    </Box>
  );
}

export default Manufacture;
