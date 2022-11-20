import { jsPDF } from "jspdf";
import { Flex, Image, Button, Box, Text } from "@chakra-ui/react";
import SharedGoals from "@/assets/images/Shared goals.svg";
import { useFile } from "@/components/FileProvider";
import { useCanvas } from "@/components/CanvasProvider";
import { useNavigate } from "react-router-dom";
const pdf = new jsPDF();
const Finish = () => {
  const navigate = useNavigate();
  const { file, fileName, sequence } = useFile();
  const downloadPDF = () => {
    console.log("sequence", sequence.length);

    sequence.forEach((doc, i) => {
      console.log("doc", doc);

      // const doc = canvas.current!.toDataURL({ format: "image/png" });
      const width = pdf.internal.pageSize.width;
      const height = pdf.internal.pageSize.height;
      pdf.addImage(doc, "png", 0, 0, width, height);
      if (i !== sequence.length - 1) {
        pdf.addPage();
      }
    });
    pdf.save(fileName ?? "download.pdf");
  };

  const goIndex = () => {
    navigate("/");
  };
  return (
    <Flex
      h="calc(100vh - 120px)"
      bgColor="rgba(206, 229, 228, 0.2)"
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Flex
        maxW={"800px"}
        w={"2/3"}
        flexDir={{ base: "column", lg: "row" }}
        alignItems={"center"}
      >
        <Image maxW={{base:'300px', lg:"400px"}} w={"1/2"} src={SharedGoals} />
        <Box w={"1/2"}>
          <Text textStyle="h1" mb={2} color={"primary.default"}>
            恭喜您！檔案已就緒
          </Text>
          <Text pb={10} color={"gray.400"}>
            現在您可以下載檔案或或重新上傳檔案。
          </Text>
          <Button mb={2} w={"100%"} onClick={downloadPDF}>
            下載檔案
          </Button>
          <Text cursor={'pointer'} color={"gray.500"} onClick={goIndex} textAlign={"center"}>
            重新上傳
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Finish;
