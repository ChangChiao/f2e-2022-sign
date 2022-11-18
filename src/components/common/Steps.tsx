import React from "react";
import { Flex, Text, Box, Center } from "@chakra-ui/react";
import { useStep } from "../../components/StepProvider";
import { ReactComponent as Check } from "../../assets/icon/Check.svg";
const stepList = [
  { label: "上傳檔案" },
  { label: "加入簽名檔案" },
  { label: "Step 3" },
  { label: "下載檔案" },
];

const Steps = () => {
  const { nextStep, prevStep, reset, activeStep } = useStep();
  return (
    <Flex py={4} justifyContent={"center"}>
      {stepList.map((item, i) => (
        <Flex key={i} justifyContent={"space-between"} alignItems={"center"}>
          <Center
            fontWeight={"bold"}
            borderRadius={"50%"}
            w={10}
            h={10}
            color={i <= activeStep ? "white" : "gray.500"}
            bgColor={i <= activeStep ? "primary.default" : "gray.200"}
            border={i === activeStep ? "2px " : "0px"}
            borderColor={i <= activeStep ? "primary.default" : "gray.200"}
          >
            {i >= activeStep ? i + 1 : <Check color="#fff" width={20} />}
          </Center>
          <Text px="2" fontWeight={"bold"} as="span">
            {item.label}
          </Text>
          {i !== stepList.length - 1 && (
            <Box bgColor={"gray.200"} h="2px" w={"60px"} mr={4} />
          )}
        </Flex>
      ))}
    </Flex>
  );
};

export default Steps;
