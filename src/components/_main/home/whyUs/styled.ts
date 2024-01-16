import { Grid } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

const RootStyled = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  "& .card": {
    position: "relative",
    height: "100%",
    padding: theme.spacing(3),
    textAlign: "center",
    ".MuiButtonBase-root": {
      background: alpha(theme.palette.primary.main, 0.26),
      color: theme.palette.text.primary,
    },
    // backgroundColor: alpha(
    //   theme.palette.primary.main,
    //   theme.palette.mode === "light" ? 0.03 : 0.1
    // ),
  },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
export default RootStyled;
