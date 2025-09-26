import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
const RootStyled = styled(Box)(({ theme }) => ({
     "& .add-address-btn": {
          marginLeft: "auto",
          display: "flex",
          marginBottom: theme.spacing(2)
     },
     "& .no-data-found": {
          maxWidth: 300,
          svg: {
               width: 300,
               height: 300,
          },
     },
     "& .card-main": {
          padding: theme.spacing(3),
          marginBottom: theme.spacing(3),
          position: "relative",
          border: `1px solid ${theme.palette.divider}`,
          "&.active": {
               border: `1px solid ${theme.palette.primary.main}`,
          },
          "& .card-label-skeleton": {
               display: "flex",
               alignItems: "center",
               "& .first-skeleton": {
                    marginRight: theme.spacing(1),
               }
          },
          "& .card-label": {
               marginBottom: theme.spacing(1),
               display: "flex",
               alignItems: "center",
               "& .active": {
                    marginLeft: theme.spacing(1),
               }
          },
          "& .body2": {
               display: "flex",
               alignItems: "center",
               svg: {
                    marginRight: theme.spacing(1),
               }
          },
          "& .deliver-address-btn": {
               marginTop: theme.spacing(3),
               display: "flex",
               alignItems: "center",
               "& .card-label-skeleton": {
                    display: "flex",
                    alignItems: "center",
                    "& .first-skeleton": {
                         marginRight: theme.spacing(1),
                    }
               },
          }
     },
     [theme.breakpoints.up("sm")]: {
          "& .deliver-address-btn": {
               position: "absolute",
               right: 24,
               bottom: 24,
          }
     }
}));
export default RootStyled;
