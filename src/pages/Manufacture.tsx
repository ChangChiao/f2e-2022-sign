import React from "react";
import ProgressBar from "../components/ProgressBar";
import Sign from "../components/Sign";
import PDF from "../components/PDF";

import ModalBox from "../components/ModalBox";
function Manufacture() {
  return (
    <div>
      <ModalBox />
      <ProgressBar />
      <Sign />
      <PDF />
    </div>
  );
}

export default Manufacture;
