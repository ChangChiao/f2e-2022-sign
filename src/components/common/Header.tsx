import React, { useEffect, useState } from "react";
import logo from "../../assets/images/Logo.png";
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
import { useFile } from "../../components/FileProvider";
import { ReactComponent as Edit } from "../../assets/icon/Edit.svg";
import ModalBox from "../../components/ModalBox";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const { file, setFile, getFile } = useFile();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editFileName = () => {
    setFileName(file.current?.name ?? "");
    onOpen();
  };

  const rename = () => {
    const newFile = new File([file.current!], fileName, {
      type: file.current!.type,
    });
    setFile(newFile);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFileName(value);
  };
  useEffect(() => {
    console.log('getFile', getFile());
  }, []);
  return (
    <Flex
      as="header"
      alignItems={"center"}
      justifyContent={"space-between"}
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
          <Button>設定</Button>
        </>
      ) : (
        <Flex alignItems={"center"}>
          <Text fontWeight={'bold'}  pr={2}>{file.current?.name}</Text>
          <Edit onClick={editFileName} cursor={"pointer"} width={"30px"} />
        </Flex>
      )}
      <ModalBox isOpen={isOpen} onClose={onClose}>
        <Text
          pb={2}
          color={"primary.default"}
          fontWeight={'bold'}
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
          value={fileName}
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
