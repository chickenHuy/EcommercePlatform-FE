import { useState } from "react";
import "./style.css";

const Loading = () => {

  return (
    <div className="w-full h-full bg-transparent-primary">
      <div id="box-container" className="scale-50">
        <div class="boxes box1"></div>
        <div class="boxes box2"></div>
        <div class="boxes box3"></div>
      </div>
    </div>
  );
};

export default Loading;
