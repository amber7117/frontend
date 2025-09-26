import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const RootStyled = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
export default RootStyled;
