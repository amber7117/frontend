import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";

const RootStyled = styled(Paper)(({ theme }) => ({
  position: "relative",
  ".main-paper": {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "35%",
    overflow: "hidden",
    width: "calc(100% + 48px)",
    marginLeft: "-24px",
  },

  borderRadius: 0,
  "& .motion-dev": {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    top: 0,
    paddingLeft: `24px !important`,
    paddingRight: `24px !important`,
  },
  "& .slide-wrapper": {
    position: "relative",
    paddingBottom: "38%",
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
  "& .slider-arrows": {
    position: "absolute",
    transform: "translateY(-50%)",
    width: "calc(100% + 50px)",
    marginLeft: "-25px",
    zIndex: 222,
    top: "45%",
    "& .left": {
      left: 0,
    },
    "& .right": {
      right: 0,
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
  [theme.breakpoints.down("lg")]: {
    ".main-paper": {
      paddingTop: "50%",
      width: "100%",
      marginLeft: 0,
      "& .slide-wrapper ": {
        paddingBottom: "50%",
      },
    },
    "& .slider-arrows": {
      width: "100%",
      marginLeft: 0,
    },
    [theme.breakpoints.down("md")]: {
      ".main-paper": {
        width: "100%",
        border: "none",
        marginLeft: 0,
        paddingTop: "73%",
        "& .slide-wrapper ": {
          paddingBottom: "73%",
          img: {
            objectPosition: theme.direction === "rtl" ? "right" : "left",
          },
        },
        "& .card-content": {
          maxWidth: 400,
        },
      },
      "& .slider-arrows": {
        width: "100%",
        marginLeft: 0,
      },
    },
    [theme.breakpoints.down("sm")]: {
      ".main-paper": {
        width: "100%",
        marginLeft: 0,
        paddingTop: "122%",
        "& .slide-wrapper ": {
          paddingBottom: "142%",
        },
        "& .card-content": {
          maxWidth: "80%",
        },
      },
      "& .slider-arrows": {
        width: "100%",
        marginLeft: 0,
      },
    },
  },
}));
export default RootStyled;
