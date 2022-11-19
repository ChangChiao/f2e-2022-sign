import React, { useEffect } from 'react'
import { useStep } from "@/components/StepProvider";
import UploadPDF from '@/components/UploadPDF';
import {
  Box,
  Button,
} from "@chakra-ui/react";
import IndexSteps from '@/components/IndexSteps';
const Index = () => {
  const { reset } = useStep();
  useEffect(() => {
    reset();
  }, [])
  return (
    <Box mx={"auto"} w={"90%"}>
      <UploadPDF />
      <IndexSteps />
    </Box>
  )
}

export default Index