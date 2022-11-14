import React from "react";
import Order from "./common/Order";
import FileUpload from "../assets/images/File-upload.svg";
import Signing from "../assets/images/Signing.svg";
import Sending from "../assets/images/Sending.svg";
import { Flex, Text, Image } from "@chakra-ui/react";

const stepList = [
  {
    title: "上傳檔案",
    content: "選擇PDF檔或是IMG檔",
    img: FileUpload
  },
  {
    title: "加入簽名檔",
    content: "手寫、輸入或是上傳簽名檔",
    img: Signing
  },
  {
    title: "下載與傳送",
    content: "完成簽署可立即傳送檔案給對方",
    img: Sending
  },
];
function IndexSteps() {
  return (
    <Flex justifyContent={'space-between'}  alignItems={'center'}>
      {stepList.map((item, i) => (
        <Flex key={i} flexDir={'column'}  alignItems={'center'}>
          <Order num={i + 1} />
          <Text textStyle='h5' py="2">{item.title}</Text>
          <Text as="span">{item.content}</Text>
          <Image w={'200px'} h={'200px'} src={item.img}  />
        </Flex>
      ))}
    </Flex>
  );
}

export default IndexSteps;
