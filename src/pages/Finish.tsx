import React from "react";
import { Flex, Image, Button, Box, Text } from "@chakra-ui/react";
import SharedGoals from "../assets/images/Shared goals.svg";
const Finish = () => {
  return (
    <Flex h={"full"} w={"full"} bgColor={"primary.light"} justifyContent={'center'} alignItems={'center'}>
      <Flex w={'500px'} flexDir={{ base: "column", lg: "row" }} alignItems={"center"}>
        <Image w={"300px"} h={"300px"} src={SharedGoals} />
        <Box w={"2/3"}>
          <Text textStyle="h1" color={"primary.default"}>
            恭喜您！檔案已就緒
          </Text>
          {/* <Text>
        現在您可以下載檔案或註冊會員，以體驗更多功能。
        </Text> */}
          <Button w={"100%"}>下載檔案</Button>
          <Button w={"100%"}>重新上傳</Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Finish;
