import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const RootStyled = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .description": {
    textTransform: "capitalize",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(5),
  },
  "& .slider-main": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
    minWidth: "80px",
    height: "80px",
    borderRadius: "10px",
    width: "100%",
    position: "relative",
    img: {
      height: 60,
    },
  },
  ".marquee-container": {
    ".marquee": {
      marginBottom: theme.spacing(8),
    },
  },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
export default RootStyled;
