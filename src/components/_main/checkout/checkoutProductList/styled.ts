import TableContainer from "@mui/material/TableContainer";
import { styled } from "@mui/material/styles";
const RootStyled = styled(TableContainer)(({ theme }) => ({
  // minWidth: 720,
  "& .table-head-row": {
    "& .MuiTableCell-root": {
      color: theme.palette.common.white,
      background: theme.palette.primary.main,
    },
  },
  "& .product-sec": {
    display: "flex",
    alignItems: "center",
    "& .subtitle": {
      maxWidth: 240,
      marginBottom: theme.spacing(0.5),
    },
    "& .MuiDivider-root": {
      height: 14,
      alignSelf: "center",
    },
  },
}));
export default RootStyled;
