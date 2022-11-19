import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Textarea,
  Button,
  Box
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const Content = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = (data: object) => {
    console.log("onSubmit", data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl mt={2} isInvalid={Boolean(errors.content)}>
        <FormLabel fontWeight={"bold"} htmlFor="content">
          新增文字
        </FormLabel>
        <Textarea
          id="content"
          placeholder="請輸入內容"
          {...register("content", {
            required: "內容不得為空",
          })}
        />
        <FormErrorMessage>
          {errors.content && errors.content.message?.toString()}
        </FormErrorMessage>
        <Box textAlign={'center'}>
          <Button mt={10} mx={"auto"} isLoading={isSubmitting} type="submit">
            新增文字
          </Button>
        </Box>
      </FormControl>
    </form>
  );
};

export default Content;