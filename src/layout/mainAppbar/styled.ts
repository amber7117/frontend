import AppBar from "@mui/material/AppBar";
import { styled, alpha } from "@mui/material/styles";

const RootStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  top: -1,
  backgroundColor: "transparent",
  borderTop: `1px solid ${theme.palette.divider}`,
  borderLeftWidth: 0,
  borderLeftRight: 0,
  display: "block",
  "& .toolbar": {
    justifyContent: "space-between",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
    backgroundColor: alpha(theme.palette.background.paper, 1),
    padding: theme.spacing(0, 3),
    backDropFilter: "blur(16px)",
  },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
export default RootStyled;
