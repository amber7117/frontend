// react
import { useState, useEffect } from "react";

// next
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";

// material
import {
  Card,
  IconButton,
  Typography,
  CardHeader,
  Tooltip,
  CardContent,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

// redux
import { useSelector } from "react-redux";
// components
const RootStyled = dynamic(() => import("./styled"));
// ----------------------------------------------------------------------

export default function CheckoutBillingInfo({ ...props }) {
  const { onBackStep } = props;
  const { t } = useTranslation("checkout");
  const { product, user: userState } = useSelector((state: any) => state);
  const { user } = userState;
  const { billing } = product.checkout;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, [loading]);

  return (
    <RootStyled>
      <CardHeader
        className="card-header"
        title={t("billing-address")}
        action={
          <Tooltip title="Edit address">
            <IconButton
              size="small"
              type="button"
              color="primary"
              onClick={onBackStep}
            >
              <EditRoundedIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {(!loading && billing?.fullName) || user?.fullName}
        </Typography>
        <Typography variant="body2" gutterBottom noWrap>
          {`${!loading && billing?.address} ${!loading && billing?.city} ${
            !loading && billing?.state
          } ${!loading && billing?.zip}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {!loading && billing?.phone}
        </Typography>
      </CardContent>
    </RootStyled>
  );
}
