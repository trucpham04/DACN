import type * as React from "react";

export interface ToolbarAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  hidden?: boolean;
  variant?: "default" | "outline" | "destructive" | "ghost" | "secondary";
}

export interface ToolbarActionGroup {
  primary: ToolbarAction;
  menuActions?: ToolbarAction[];
}
