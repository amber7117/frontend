import { styled, alpha } from "@mui/material/styles";
import Card from "@mui/material/Card";

const RootStyled = styled(Card)(({ theme }) => ({
     "& .detail-card": {
          minHeight: 226,
          "& .detail-card-btn": {
               display: "block",
               minWidth: 50,
               lineHeight: 0,
               minHeight: 50,
               color: theme.palette.text.primary,
               background: alpha(theme.palette.primary.main, 0.3),
               "&:hover": {
                    background: theme.palette.primary.dark,
               },
               "& .email-heading": {
                    wordWrap: "break-word",
               }
          }
     },
     "& .skeleton": {
          marginLeft: "auto"
     }
}));
export default RootStyled;