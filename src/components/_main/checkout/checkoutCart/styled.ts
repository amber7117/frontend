import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const RootStyled = styled(Box)(({ theme }) => ({
     "& .card-main": {
          marginBottom: theme.spacing(3),
          "& .card-header": {
               marginBottom: theme.spacing(3),
          },
     },
     [theme.breakpoints.down("sm")]: {
          "& .product-list": {
               display: "none",
          },
     }
}));
export default RootStyled;
