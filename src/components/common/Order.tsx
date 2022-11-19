import { Center } from "@chakra-ui/react";

const Order = ({ num }: { num: number }) => {
  return (
    <Center 
      width={10}
      height={10}
      fontWeight="bold"
      borderRadius={"50%"}
      borderWidth={"2px"}
      borderColor={"primary.default"}
      color={"primary.default"}
    >
      {num}
    </Center>
  );
}

export default Order;
