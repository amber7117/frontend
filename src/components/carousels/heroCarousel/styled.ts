import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";

const RootStyled = styled(Paper)(({ theme }) => ({
  width: "100%",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  paddingTop: "40%",
  borderRadius: 0,
  // borderBottom: "1px solid " + theme.palette.divider,
  "& .motion-dev": {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    top: 0,
  },
  "& .slide-wrapper": {
    position: "relative",
    paddingBottom: "40%",
    zIndex: 11,
    backgroundColor: "transparent",
    borderRadius: 0,
    img: {
      borderRadius: 0,
      objectPosition: "center",
      ...(theme.direction === "rtl" && {
        "-webkit-transform": "scaleX(-1)",
        transform: "scaleX(-1)",
      }),
    },
  },
  "& .bg-overlay": {
    top: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    background:
      theme.palette.mode === "dark" ? alpha(theme.palette.grey[800], 0.2) : "",
  },
  "& .card-content": {
    top: "50%",
    left: 0,
    transform: "translateY(-50%)",
    width: "100%",
    maxWidth: 630,
    textAlign: "left",
    position: "absolute",
    color: theme.palette.common.white,
    h1: {
      color: theme.palette.grey[800],
      fontWeight: 700,
      pointerEvents: "none",
    },
    h6: {
      color: theme.palette.grey[800],
      fontWeight: 400,
      pointerEvents: "none",
      marginTop: theme.spacing(1),
    },
  },
  [theme.breakpoints.down("md")]: {
    border: "none",
    paddingTop: "62%",
    "& .slide-wrapper ": {
      paddingBottom: "62%",
      img: {
        objectPosition: theme.direction === "rtl" ? "right" : "left",
      },
    },
    "& .card-content": {
      maxWidth: 400,
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& .card-content": {
      maxWidth: "80%",
    },
  },
}));
export default RootStyled;
