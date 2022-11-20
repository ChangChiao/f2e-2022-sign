import React, { useEffect, useState } from "react";
import logo from "@/assets/images/Logo.png";
import {
  Box,
  Input,
  Text,
  Flex,
  Image,
  Button,
  useDisclosure,
  FormLabel,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as Edit } from "@/assets/icon/Edit.svg";
import { useNavigate } from "react-router-dom";
import { useFile } from "@/components/FileProvider";
import ModalBox from "@/components/modal/ModalBox";
const Header = () => {
  const { file, fileName, getFileName, setFileNameLocal, setFile, getFile } =
    useFile();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editName, setEditName] = useState("");

  const editFileName = () => {
    setEditName(getFileName());
    onOpen();
  };

  const rename = () => {
    // const newFile = new File([file.current!], fileName, {
    //   type: file.current!.type,
    // });
    setFileNameLocal(editName);
    // setFile(newFile);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditName(value);
  };

  useEffect(() => {
    setEditName(getFileName());
  }, []);
  return (
    <Flex
      as="header"
      position={"relative"}
      alignItems={"center"}
      justifyContent={{ base: "center", lg: "space-between" }}
      borderBottom={"1px"}
      borderColor={"gray.300"}
      height={"80px"}
      px={"80px"}
    >
      {location.pathname !== "/manufacture" ? (
        <>
          <Link to="/">
            <Image src={logo} />
          </Link>
          <Text
            position={"absolute"}
            display={{ base: "none", lg: "block" }}
            textAlign={"center"}
            color={"gray.400"}
            textStyle={"h1"}
            left={0}
            right={0}
            mx={"auto"}
          >
            快速省時的電子簽署工具
          </Text>
        </>
      ) : (
        <Flex alignItems={"center"}>
          <Text fontWeight={"bold"} pr={2}>
            {fileName}
          </Text>
          <Edit onClick={editFileName} cursor={"pointer"} width={"30px"} />
        </Flex>
      )}
      <ModalBox isOpen={isOpen} onClose={onClose}>
        <Text
          pb={2}
          color={"primary.default"}
          fontWeight={"bold"}
          borderBottom={"1px"}
          textAlign={"center"}
          borderColor={"primary.default"}
        >
          重新命名檔案
        </Text>
        <FormLabel pt={2} htmlFor="fileName">
          檔案
        </FormLabel>
        <Input
          value={editName}
          onChange={handleChange}
          id="fileName"
          maxLength={50}
          placeholder="請輸入檔案名稱"
        />
        <Flex pt={4} justifyContent={"center"}>
          <Button
            onClick={rename}
            variant={fileName.length === 0 ? "disable" : "solid"}
          >
            儲存
          </Button>
        </Flex>
      </ModalBox>
    </Flex>
  );
};

export default Header;
