import React from 'react'
import { Link } from "react-router-dom";
import UploadPDF from '../components/UploadPDF';
import {
  Box,
  Button,
} from "@chakra-ui/react";
import IndexSteps from '../components/IndexSteps';
function Index() {
  return (
    <Box mx={"auto"} w={"90%"}>
      <UploadPDF />
      <Link to={{pathname: "/manufacture"}}>Go index</Link>
      <Button>c c c</Button>
      <IndexSteps />
    </Box>
  )
}

export default Index