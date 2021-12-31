import * as React from "react";

type Props = {
  onClick?: (event: React.MouseEvent) => void;
  children: React.ReactNode;
};
export const Button = (props: Props) => {
  const { onClick, children } = props;
  return (
    <button
      className="border border-gray-400 rounded px-4 py-2 mt-4 hover:(bg-teal-400 border-teal-400)"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
