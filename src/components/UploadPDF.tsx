import React, { useState, useCallback } from "react";
import { useStep } from "../components/StepProvider";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import addFile from "../assets/images/Add file.svg";
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
function UploadPDF() {
  const [isFail, setFail] = useState(false);
  const { nextStep, prevStep, setStep, reset, activeStep } = useStep();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const onDrop = useCallback((acceptedFiles: unknown) => {
    console.log("acceptedFiles", acceptedFiles);
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const onSubmit = () => {
    console.log("onSubmit");
  };

  return (
    // <FileUploader hoverTitle="" handleChange={handleChange} name="file" types={fileTypes}>
    <Flex
      w={"100%"}
      justifyContent={'center'}
      alignItems={'center'}
      h={'400px'}
      mt={10}
      bgColor={"primary.light"}
      borderRadius={1}
      borderStyle={"dashed"}
      borderWidth={"2px"}
      borderColor={"primary.default"}
      {...getRootProps()}
    >
      <FormLabel htmlFor="file">
        <input {...getInputProps()} />
        {/* {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )} */}
        <Flex flexDir={'column'} alignItems={'center'}>
          <Image src={addFile} />
          <Text as="span" fontSize={'sm'}>將檔案拖曳到這裡</Text>
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
          <Text color={"primary.default"} pt={2} fontSize={'sm'} fontWeight="bold">
            檔案大小10Mb以內，檔案格式為PDF、IMG
          </Text>
        </Flex>
      </FormLabel>

      <FormErrorMessage>
        {errors.file && errors.file.message?.toString()}
      </FormErrorMessage>
      {isFail && (
        <Flex alignItems={"center"}>
          <Image w={"300px"} h={"300px"} src={wrongImg} />
          <Box w={"2/3"}>
            <Text textStyle="h1" color={"primary.default"}>
              您的檔案無法上傳
            </Text>
            <Text>
              請重新上傳檔案。確認檔案大小在10Mb以內，檔案格式為PDF、IMG。
              若還是無法上傳檔案，請聯繫快點簽
            </Text>
            <Button w={"100%"}>重新上傳</Button>
          </Box>
        </Flex>
      )}
{/* 
      <Button size="sm" onClick={nextStep}>
        next
      </Button> */}
    </Flex>
  );
}

export default UploadPDF;
