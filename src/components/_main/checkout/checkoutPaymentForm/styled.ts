import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
const RootStyled = styled(Box)(({ theme }) => ({
     paddingBottom: theme.spacing(3),
     "& div[role='alert']": {
          marginTop: theme.spacing(3),
     },
}));
export default RootStyled;
