import { Card } from "@apitool/ui";
import { cn } from "@apitool/utils";
import Tilt from "react-parallax-tilt";

import { defaultTiltProps } from "@/client/constants/parallax-tilt";

type Props = {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export const BaseCard = ({ children, className, onClick }: Props) => (
  <Tilt {...defaultTiltProps}>
    <Card
      onClick={onClick}
      className={cn(
        "relative flex aspect-[1/1] scale-100 cursor-pointer items-center justify-between bg-secondary/50 p-6 transition-transform active:scale-95",
        className,
      )}
    >
      {children}
    </Card>
  </Tilt>
);
