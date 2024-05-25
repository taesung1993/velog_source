import { ComponentProps } from "react";

interface Props extends ComponentProps<"p"> {
  children: React.ReactNode;
}

export default function Text({ children, ...props }: Props) {
  return <p {...props}>{children}</p>;
}
