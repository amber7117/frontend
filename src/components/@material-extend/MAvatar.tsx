import React, { forwardRef } from "react";
import { Avatar, useTheme } from "@mui/material";

interface MAvatarProps {
  children?: React.ReactNode;
  src?: string;
  alt: string;
  sx?: any;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error";
}

const MAvatar = forwardRef<HTMLDivElement, MAvatarProps>(
  ({ color = "default", sx, children, ...other }, ref) => {
    const theme = useTheme();

    if (color === "default") {
      return (
        <Avatar ref={ref} sx={sx} {...other}>
          {children}
        </Avatar>
      );
    }

    return (
      <Avatar
        ref={ref}
        sx={{
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette[color].contrastText,
          backgroundColor: theme.palette[color].main,
          ...sx,
        }}
        {...other}>
        {children}
      </Avatar>
    );
  }
);

export default MAvatar;
