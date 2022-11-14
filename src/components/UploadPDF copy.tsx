import React, { useState } from "react";
import { useStep } from "../components/StepProvider";
import { useForm } from "react-hook-form";
// import { FileUploader } from "react-drag-drop-files";
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
  const [dragActive, setDragActive] = useState(false);
  const onSubmit = () => {
    console.log("onSubmit");
  };

  const handleChange = function(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      console.log("e.target.files[0]", e.target.files[0])
    }
  };
  const handleDrag = function(e: React.DragEvent<HTMLFormElement> | React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function(e: React.DragEvent<HTMLFormElement> | React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log("e.dataTransfer.files[0]", e.dataTransfer.files[0])
    }
  };

  return (
    // <FileUploader hoverTitle="" handleChange={handleChange} name="file" types={fileTypes}>
      <form onDragEnter={handleDrag} onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Boolean(errors.name)}>
          <FormLabel
            htmlFor="file"
          >
          <Input
            id="file"
            opacity={0}
            type={"file"}
            placeholder="file"
            {...register("file", {
              required: "This is required",
              validate: {
                biggerThan1MB: (files) => files[0]?.size < 1048576 || "Max 1MB",
                acceptedFormats: (files) =>
                  files[0]?.type === "application/pdf" || "Only PDF",
              },
            })}
          />

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
          { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
          <FormErrorMessage>
            {errors.file && errors.file.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <Button variant="base" size="sm" onClick={nextStep}>
          next
        </Button>
      {/* </FileUploader> */}
      </form>
  );
}

export default UploadPDF;
