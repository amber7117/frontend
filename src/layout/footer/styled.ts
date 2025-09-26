import Box from "@mui/material/Box";
import { styled, alpha } from "@mui/material/styles";

const RootStyled = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  // borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(3),

  "& .grid-container": {
    padding: theme.spacing(2, 0, 4, 0),
    "& .logo": {
      display: "flex",
      alignItems: "center",
      position: "relative",
      width: 232,
      height: 60,
    },
    "& .text-link": {
      display: "flex",
      alignItems: "center",
      transition: ".2s ease-in",
      "&:hover": {
        color: theme.palette.primary.main,
      },
      svg: {
        marginRight: theme.spacing(1),
      },
    },
    "& .social-main": {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(0),
      [theme.breakpoints.down("md")]: {
        marginBottom: theme.spacing(5),
      },
    },
    "& .list-button": {
      padding: theme.spacing(0.7, 0.5),
      transition: "all 0.4s ease-in-out",
      "&:hover,&:active": {
        color: theme.palette.primary.main,
      },
    },
  },
}));
export default RootStyled;
