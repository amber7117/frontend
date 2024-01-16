import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
const RootStyled = styled(Box)(({ theme }) => ({
  "& .link-text": {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "color 0.2s ease-in-out",
    "&:hover": {
      color: theme.palette.primary.main,
    },
    "&.active": {
      color: theme.palette.primary.main,
    },
  },
}));
export default RootStyled;
