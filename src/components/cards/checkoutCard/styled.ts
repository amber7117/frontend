import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const RootStyled = styled(Box)(({ theme }) => ({
     "& .card-main": {
          padding: theme.spacing(2),
          borderWidth: "1px 0 0 0",
          borderRadius: 0,
          "& .delete-icon": {
               fontSize: 20
          }
     },
     [theme.breakpoints.up("sm")]: {
          display: "none",
     }
}));
export default RootStyled;
