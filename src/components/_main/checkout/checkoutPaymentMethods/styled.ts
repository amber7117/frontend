import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
const RootStyled = styled(Card)(({ theme }) => ({
     marginBottom: theme.spacing(3),
     "& .card-header": {
          span: { fontSize: "1.5rem" },
     },
     "& .form-control-label": {
          flexGrow: 1,
          paddingTop: theme.spacing(3),
          paddingBottom: theme.spacing(3),
     },
     "& .logo-card": {
          marginRight: theme.spacing(1),
     },
     "& .img-icon": {
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          "& .credit_card": {
               width: '100%'
          },
          [theme.breakpoints.down("sm")]: {
               display: "none",
          },
     }

}));
export default RootStyled;
