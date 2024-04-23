import { useTheme } from "@apitool/hooks";
import { cn } from "@apitool/utils";

type Props = {
  size?: number;
  className?: string;
};

export const Icon = ({ size = 32, className }: Props) => {
  const { isDarkMode } = useTheme();

  let src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  switch (isDarkMode) {
    case false:
      src = "/icon/dark.svg";
      break;
    case true:
      src = "/icon/light.svg";
      break;
  }

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt="APITool"
      className={cn("rounded-sm", className)}
    />
  );
};
