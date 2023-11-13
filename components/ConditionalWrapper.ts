import { ReactNode } from "react";

export type ConditionalWrapperProps = {
  condition?: boolean;
  wrapper: (children: ReactNode) => ReactNode;
  children: ReactNode;
};

export function ConditionalWrapper({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) {
  return condition ? wrapper(children) : children;
}
