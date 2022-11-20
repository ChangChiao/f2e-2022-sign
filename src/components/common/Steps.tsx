import React from "react";
import { Flex, Text, Box, Center } from "@chakra-ui/react";
import { useStep } from "@/components/StepProvider";
import { ReactComponent as Check } from "@/assets/icon/Check.svg";
const stepList = [
  { label: "上傳檔案" },
  { label: "加入簽名檔案" },
  { label: "下載檔案" },
];

const Steps = () => {
  const { nextStep, prevStep, reset, activeStep } = useStep();
  return (
    <Flex py={4} justifyContent={"center"}>
      {stepList.map((item, i) => (
        <Flex key={i} justifyContent={"space-between"} alignItems={"center"}>
          <Center
            position={'relative'}
            fontWeight={"bold"}
            borderRadius={"50%"}
            w={10}
            h={10}
            _before={{
              content: `""`,
              position: "absolute",
              width: "48px",
              height: "48px",
              border: "2px solid",
              borderRadius: '50%',
              borderColor: "primary.default",
              // bgColor: 'pink',
              opacity: "0.3",
              left: '-6px',
              right: 0,
              top: 0,
              bottom: 0,
              margin: 'auto',
              display: i === activeStep ? "block" : "none"
            }}
            color={i <= activeStep ? "white" : "gray.500"}
            bgColor={i <= activeStep ? "primary.default" : "white"}
            border={i === activeStep ? "2px " : "2px"}
            borderColor={i <= activeStep ? "primary.default" : "gray.300"}
          >
            {i >= activeStep ? i + 1 : <Check color="#fff" width={20} />}
          </Center>
          <Text px="2" fontWeight={400} as="span">
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
