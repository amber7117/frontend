import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";

const RootStyled = styled(Card)(({ theme }) => ({
  "& .card-action-area": {
    padding: theme.spacing(1),
    textAlign: "center",
  },
  "& .badge": {
    float: "right",
    marginRight: theme.spacing(0.7),
    marginTop: theme.spacing(0.7),
  },
  "& .image-wrapper": {
    position: "relative",
    width: "100%",
    img: {
      borderRadius: "8px 8px 0 0",
    },
    "&:after": {
      content: `""`,
      display: "block",
      paddingBottom: "100%",
    },
  },
  "& .title": {
    marginTop: theme.spacing(0.5),
    textTransform: "capitalize",
  },
}));
export default RootStyled;
