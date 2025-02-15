import React, { ReactNode } from "react";

type Props = {
  main: string;
  text: string;
  icon: ReactNode;
};

const ToastText = ({ main, text, icon }: Props) => {
  return (
    <div className="flex gap-2 items-center">
      {icon}
      <p>
        <span className="font-bold">{main}</span> {text}
      </p>
    </div>
  );
};

export default ToastText;
