import React from "react";
import "./styles.css";
import { ReactComponent as DownloadIcon } from "../../assets/icons/download_icon.svg"

function DownloadButton({ onClick, label = "" }) {
  return (
    <div className="button" onClick={onClick}>
      <DownloadIcon className="icon" />
      <div className="label">{label}</div>
    </div>
  );
}

export default DownloadButton;
