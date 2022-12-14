import React, { useEffect } from 'react'
import { useStep } from "@/provider/StepProvider";
import { useFile } from "@/provider/FileProvider";
import UploadPDF from '@/components/UploadPDF';
import {
  Box,
  Button,
} from "@chakra-ui/react";
import IndexSteps from '@/components/IndexSteps';

const Index = () => {
  const { resetFile } = useFile();
  const { reset } = useStep();
  useEffect(() => {
    reset();
    resetFile();
    localStorage.removeItem("doc");
    localStorage.removeItem("fileName");
  }, []);
  return (
    <Box mx={"auto"} w={"90%"} h={{ base: "auto", lg: "calc(100vh - 120px)" }}>
      <UploadPDF />
      <IndexSteps />
    </Box>
  );
};

export default Index;
