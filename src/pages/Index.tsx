import React from 'react'
import { Link } from "react-router-dom";
import UploadPDF from '../components/UploadPDF';
import {
  Box,
  Button,
} from "@chakra-ui/react";
import IndexSteps from '../components/IndexSteps';
const Index = () => {
  return (
    <Box mx={"auto"} w={"90%"}>
      <UploadPDF />
      <IndexSteps />
    </Box>
  )
}

export default Index