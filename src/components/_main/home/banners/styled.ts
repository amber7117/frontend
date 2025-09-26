import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";

const RootStyled = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  "& .main-card": {
    border: `1px solid ${theme.palette.primary.main}`,
    background: alpha(theme.palette.primary.main, 0.1),
    boxShadow: "none",
  },
  "& .main-card-1": {
    border: `1px solid ${theme.palette.warning.main}`,
    background: alpha(theme.palette.warning.main, 0.1),
    boxShadow: "none",
  },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
export default RootStyled;
