import React from "react";
import { ReactComponent as Add } from "../../assets/icon/Add.svg";
import { ReactComponent as Edit } from "../../assets/icon/Edit.svg";
import { ReactComponent as CalendarToday } from "../../assets/icon/CalendarToday.svg";
import { useStep } from "../../components/StepProvider";
import { Box, Button, Text } from "@chakra-ui/react";
function Side() {
  const { nextStep, prevStep, setStep, reset, activeStep } = useStep();
  return (
    <Box w={"400px"} h="calc(100vh - 200px)" p={4}>
      <Text textStyle={"label"} pb={2}>
        我的簽名
      </Text>
      <Button w={"full"} variant={"outline"}>
        <Add width={"30px"} />
        <Text pl={2}> 加入簽名</Text>
      </Button>
      <Button w={"full"} variant={"outline"}>
        <Edit width={"30px"} />
        <Text pl={2}> 加入文字</Text>
      </Button>

      <Button w={"full"} variant={"outline"}>
        <CalendarToday width={"30px"} />
        <Text pl={2}> 加入日期</Text>
      </Button>
      <Button w={"full"} color={"gray.400"}
          bgColor={"gray.200"}
          variant={"outline"}>
        <Text pl={2}> 重新上傳檔案</Text>
      </Button>
      <Box>
        <Button
        w={"full"}
        >
          {" "}
          下一步
        </Button>
      </Box>
    </Box>
  );
}

export default Side;
