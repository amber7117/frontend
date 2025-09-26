import { useTheme } from "@mui/material";
import RootStyled from "./styled";
// ----------------------------------------------------------------------
export default function MenuPopover({ ...props }) {
  const theme = useTheme();
  const { children, open, sx, isDesktop, ...other } = props;
  return (
    <RootStyled
      anchorOrigin={{
        vertical: "bottom",
        horizontal: isDesktop ? "center" : "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: isDesktop ? "center" : "right",
      }}
      open={open}
      {...other}
      PaperProps={{
        className: isDesktop && "is-desktop",
        sx: {
          ...sx,
        },
      }}>
      {children}
    </RootStyled>
  );
}
