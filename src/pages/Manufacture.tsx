import React from "react";
import ProgressBar from "../components/ProgressBar";
import Sign from "../components/Sign";
import PDF from "../components/PDF";
import ModalBox from "../components/ModalBox";
import BtnGroup from "../components/BtnGroup";
function Manufacture() {
  return (
    <div>
      <ModalBox />
      {/* <ProgressBar /> */}
      <Sign />
      <PDF />
      <BtnGroup />
    </div>
  );
}

export default Manufacture;
