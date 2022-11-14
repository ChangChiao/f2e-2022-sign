import React from 'react'
import { Link } from "react-router-dom";
import UploadPDF from '../components/UploadPDF';
import {
  Button,
} from "@chakra-ui/react";
import IndexSteps from '../components/IndexSteps';
function Index() {
  return (
    <div>
      <h1>Index</h1>
      <UploadPDF />
      <Link to={{pathname: "/manufacture"}}>Go index</Link>
      <Button>c c c</Button>
      <IndexSteps />
    </div>
  )
}

export default Index