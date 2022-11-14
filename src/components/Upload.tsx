import React from "react";
import { useStep } from "../components/StepProvider";
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
function Upload() {
  const { nextStep, prevStep, setStep, reset, activeStep } = useStep();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = () => {
    console.log("onSubmit");
  };
  return (
    <div>
      Upload
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Boolean(errors.name)}>
          <FormLabel htmlFor="name">First name</FormLabel>
          <Input
            id="name"
            placeholder="name"
            {...register("name", {
              required: "This is required",
              minLength: { value: 4, message: "Minimum length should be 4" },
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message?.toString()}
          </FormErrorMessage>
          <FormLabel htmlFor="file">上傳文件</FormLabel>
          <Input
            id="file"
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
          <FormErrorMessage>
            {errors.file && errors.file.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </form>
      <Button variant="base" size="sm" onClick={nextStep}>
        next
      </Button>
    </div>
  );
}

export default Upload;
