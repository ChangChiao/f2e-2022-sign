import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { Button, Flex } from "@chakra-ui/react";
type DateProps = {
  setContent: (content: string, fontFamily?: string) => void;
};

const DateSelect = ({ setContent }: DateProps) => {
  const [selected, setSelected] = useState<Date>();
  const handleSubmit = () => {
    const date = format(selected!, 'yyyy/MM/dd');
    setContent(date);
  };
  let footer = <p>請選擇日期</p>;
  if (selected) {
    footer = <p>您選擇的日期為 {format(selected, "PP")}.</p>;
  }
  return (
    <Flex flexDir={'column'} alignItems={'center'}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        footer={footer}
      />
      <Button mt={4} onClick={handleSubmit}>確認</Button>
    </Flex>
  );
};

export default DateSelect;
