import {
  Briefcase,
  DownloadSimple,
  IconProps,
  PuzzlePiece,
  TrendUp,
} from "@phosphor-icons/react";
import { Button, ButtonProps, Tooltip } from "@apitool/ui";

export type MetadataKey =
  | "apis"
  | "tests"
  | "settings"
  | "statistics"
  | "export";

export const getSectionIcon = (id: MetadataKey, props: IconProps = {}) => {
  switch (id) {
    // Left Sidebar
    case "apis": {
      return <PuzzlePiece size={18} {...props} />;
    }
    case "tests": {
      return <Briefcase size={18} {...props} />;
    }
    case "statistics":
      return <TrendUp size={18} {...props} />;
    case "export":
      return <DownloadSimple size={18} {...props} />;
    default:
      return null;
  }
};

type SectionIconProps = ButtonProps & {
  id: MetadataKey;
  name: string;
  icon?: React.ReactNode;
};

export const SectionIcon = ({ id, name, icon, ...props }: SectionIconProps) => {
  return (
    <Tooltip side="right" content={name}>
      <Button size="icon" variant="ghost" className="size-8 rounded-full" {...props}>
        {icon ?? getSectionIcon(id, { size: 14 })}
      </Button>
    </Tooltip>
  );
};
