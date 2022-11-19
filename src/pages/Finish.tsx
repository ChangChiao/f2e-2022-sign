import { jsPDF } from "jspdf";
import { Flex, Image, Button, Box, Text } from "@chakra-ui/react";
import SharedGoals from "@/assets/images/Shared goals.svg";
import { useFile } from "@/components/FileProvider";
import { useCanvas } from "@/components/CanvasProvider";
import { useNavigate } from "react-router-dom";
const pdf = new jsPDF();
const Finish = () => {
  const navigate = useNavigate();
  const { canvas } = useCanvas();
  const { file, fileName } = useFile();
  const downloadPDF = () => {
    const doc = canvas.current!.toDataURL({ format: "image/png" });
    const width = pdf.internal.pageSize.width;
    const height = pdf.internal.pageSize.height;
    if (doc) {
      pdf.addImage(doc, "png", 0, 0, width, height);
      pdf.save(fileName ?? "download.pdf");
    }
  };

  const goIndex = () => {
    navigate("/");
  };
  return (
    <Flex
      h="calc(100vh - 120px)"
      bgColor={"primary.light"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Flex
        w={"500px"}
        flexDir={{ base: "column", lg: "row" }}
        alignItems={"center"}
      >
        <Image w={"300px"} h={"300px"} src={SharedGoals} />
        <Box w={"2/3"}>
          <Text textStyle="h4" mb={2} color={"primary.default"}>
            恭喜您！檔案已就緒
          </Text>
          {/* <Text>
        現在您可以下載檔案或註冊會員，以體驗更多功能。
        </Text> */}
          <Button mb={2} w={"100%"} onClick={downloadPDF}>
            下載檔案
          </Button>
          <Button onClick={goIndex} w={"100%"}>
            重新上傳
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Finish;
