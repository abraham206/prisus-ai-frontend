import React from "react";
import "./Backdrop.css";

export default function Backdrop(props) {
  return <div onClick={props.toggle} className="backdrop"></div>;
}
