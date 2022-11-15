import React from "react";
import one from "../../assets/icon/one.svg";
import add from "../../assets/icon/add.svg";
import CloseFullscreen from "../../assets/icon/CloseFullscreen.svg";
import FitScreen from "../../assets/icon/FitScreen.svg";
import FullScreen from "../../assets/icon/FullScreen.svg";
import Remove from "../../assets/icon/Remove.svg";
import Rotate90 from "../../assets/icon/Rotate90.svg";

interface Props {
  name: string;
  size?: number;
}

function Icon({ size, name }: Props) {
  console.log("name");

  return (
    <svg className="svg-icon" width={size} height={size} aria-hidden="true">
      <use xlinkHref={`#${one}`} />
    </svg>
  );
}

export default Icon;
