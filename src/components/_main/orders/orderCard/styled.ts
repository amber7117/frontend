import { styled, alpha } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

const RootStyled = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(1),
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));
export default RootStyled;
