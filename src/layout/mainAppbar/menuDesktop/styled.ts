import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
const RootStyled = styled(Stack)(({ theme }) => ({
     marginLeft: theme.spacing(2),
     "& .link": {
          ...theme.typography.subtitle2,
          color: theme.palette.text.primary,
          margin: theme.spacing(1.5),
          textDecoration: "none",
          fontWeight: 500,
          transition: ".2s ease-in",
          cursor: "pointer",
          "&:hover": {
               color: theme.palette.primary.main,
               textDecoration: "none",
          },
          "&.offset": {
               color: theme.palette.text.primary,
          },
          "&.active": {
               color: theme.palette.primary.main,
          },
          "& .link-icon": {
               marginLeft: theme.spacing(0.5),
               fontSize: 16
          }
     },
     "& #composition-button": {
          display: "flex",
          cursor: "pointer",
          alignItems: "center",
     },
     "&.main": {
          marginLeft: theme.spacing(0),
     },
}));
export default RootStyled;
