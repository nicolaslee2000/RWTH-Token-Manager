import React, { ReactNode } from "react";
import "./button.css";
import "@loadingio/loading.css/loading.min.css";
import "ldbutton/index.min.css";
interface buttonProps {
  children: ReactNode;
  onclick: (e: React.MouseEvent<HTMLElement>) => void;
  id?: string;
  disabled: boolean;
}

export default function Button({
  children,
  onclick,
  id,
  disabled,
}: buttonProps) {
  return (
    <button
      onClick={onclick}
      className={"button ld-ext-right" + (disabled ? " running" : "")}
      id={id ?? ""}
      disabled={disabled}
    >
      {children} <div className="ld ld-ring ld-spin"></div>
    </button>
  );
}
