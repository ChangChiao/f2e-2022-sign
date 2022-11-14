import React from 'react'
import { Link } from "react-router-dom";
import UploadPDF from '../components/UploadPDF';
function Index() {
  return (
    <div>
      <h1>Index</h1>
      <UploadPDF />
      <Link to={{pathname: "/manufacture"}}>Go index</Link>
      {/* <button>go next</button> */}
    </div>
  )
}

export default Index