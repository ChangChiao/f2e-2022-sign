import React, { useState, useCallback } from "react";
import { useStep } from "../components/StepProvider";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
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
    <Box
      w={"100%"}
      py={4}
      borderRadius={1}
      borderStyle={"dashed"}
      borderWidth={"2px"}
      borderColor={"primary.default"}
      {...getRootProps()}
    >
      <FormLabel htmlFor="file">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}

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
          上傳檔案
        </Button>
      </FormLabel>

      <FormErrorMessage>
        {errors.file && errors.file.message?.toString()}
      </FormErrorMessage>
      <Flex alignItems={"center"}>
        <Image w={'300px'} h={'300px'} src={wrongImg} />
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
      <Button variant="base" size="sm" onClick={nextStep}>
        next
      </Button>
    </Box>
  );
}

export default UploadPDF;
