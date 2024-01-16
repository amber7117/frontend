import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
const RootStyled = styled(Card)(({ theme }) => ({
     marginBottom: theme.spacing(3),
     "& .card-header": {
          span: { fontSize: "1.5rem" }
     }
}));
export default RootStyled;
