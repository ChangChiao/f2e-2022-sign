import React, { useState, useCallback } from "react";
import { useStep } from "../components/StepProvider";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
import { log } from "fabric/fabric-impl";

function UploadPDF() {
  const { nextStep, prevStep, setStep, reset, activeStep } = useStep();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const onDrop = useCallback((acceptedFiles: unknown) => {
    console.log('acceptedFiles', acceptedFiles)
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const onSubmit = () => {
    console.log("onSubmit");
  };

  return (
    // <FileUploader hoverTitle="" handleChange={handleChange} name="file" types={fileTypes}>
    <div {...getRootProps()}>
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
      <Button variant="base" size="sm" onClick={nextStep}>
        next
      </Button>
      {/* </FileUploader> */}
    </div>
  );
}

export default UploadPDF;
