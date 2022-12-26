import { useState, useCallback, useEffect } from "react";
import addFile from "@/assets/images/Add file.svg";
import { useStep } from "@/provider/StepProvider";
import { useFile } from "@/provider/FileProvider";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Box,
  Flex,
  Text,
  Image,
  Button,
} from "@chakra-ui/react";
import wrongImg from "../assets/images/Wrong.svg";
const UploadPDF = () => {
  const { setFile, resetFile, clearSequence } = useFile();
  const navigate = useNavigate();
  const [isFail, setFail] = useState(false);
  const { nextStep, prevStep, reset } = useStep();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const nextPage = () => {
    nextStep();
    navigate("/manufacture");
  };
  const onDrop = useCallback((acceptedFiles: unknown) => {
    const file = acceptedFiles as File[];
    if (file[0].type !== "application/pdf") {
      setFail(true);
      return;
    }
    setFile(file[0]);
    nextPage();
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    resetFile();
    reset();
    clearSequence()
  }, []);

  return (
    // <FileUploader hoverTitle="" handleChange={handleChange} name="file" types={fileTypes}>
    <Box pt={4}>
      <Text
        display={{ base: "block", lg: "none" }}
        textAlign={"center"}
        textStyle={"h1"}
        fontSize={"2xl"}
      >
        快速省時的電子簽署工具
      </Text>
      <Flex
        w={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        h={"400px"}
        mt={4}
        bgColor={"primary.light"}
        borderRadius={1}
        borderStyle={"dashed"}
        borderWidth={"2px"}
        borderColor={"primary.default"}
        {...getRootProps()}
      >
        {!isFail ? (
          <>
            <FormLabel htmlFor="file">
              <input {...getInputProps()} />
              <Flex flexDir={"column"} alignItems={"center"}>
                <Image src={addFile} />
                <Text
                  as="span"
                  color={"gray.500"}
                  fontWeight={"400"}
                  fontSize={"sm"}
                >
                  將檔案拖曳到這裡
                </Text>
                <Button
                  mt={4}
                  w="200px"
                  h="48px"
                  bgColor={"#0B7D77"}
                  color={"#fff"}
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  選擇檔案
                </Button>
                <Text
                  color={"primary.default"}
                  pt={2}
                  fontSize={"sm"}
                  fontWeight="700"
                >
                  檔案大小10MB以內，檔案格式為PDF
                </Text>
              </Flex>
            </FormLabel>

            <FormErrorMessage>
              {errors.file && errors.file.message?.toString()}
            </FormErrorMessage>
          </>
        ) : (
          <Flex flexDir={{ base: "column", lg: "row" }} alignItems={"center"}>
            <Image w={{base:'150px', lg:'300px'}} src={wrongImg} />
            <Box w={"300px"} pl={4}>
              <Text textStyle="h1" color={"primary.default"}>
                您的檔案無法上傳
              </Text>
              <Text color={'gray.500'} pb={10}>
                請重新上傳檔案。確認檔案大小在10MB以內，檔案格式為PDF。
                若還是無法上傳檔案，請聯繫快點簽
              </Text>
              <Button w={"100%"} onClick={()=>setFail(false)}>重新上傳</Button>
            </Box>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default UploadPDF;
