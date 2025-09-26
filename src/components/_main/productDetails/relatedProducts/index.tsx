// react
import React from "react";
import { useSelector } from "react-redux";

// next
import dynamic from "next/dynamic";

// material
import { Typography, Grid, Dialog, DialogContent, Fade } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

// components
import { NoDataFound } from "src/components/illustrations";
import { ProductsCarousel } from "src/components/carousels/productsCarousel";

// styles
import RootStyled from "./styled";
import useTranslation from "next-translate/useTranslation";

const ProductDetailsSumary = dynamic(
  () => import("src/components/_main/productDetails/summary"),
  {
    ssr: false,
  }
);
const DialogCarousel = dynamic(
  () => import("src/components/carousels/detailsCarousel/detailsCarousel"),
  {
    ssr: false,
  }
);

// ----------------------------------------------------------------------
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

export default function EcommerceShop({ ...props }) {
  const { data } = props;
  const isLoading = !data;
  const { t } = useTranslation("details");
  const { symbol, unitRate } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (data) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <RootStyled>
      <Typography variant="h2" color="text.primary" className="heading">
        {t("related-products")}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        className="description">
        {t("lorem-ipsum")}
      </Typography>
      {!isLoading && data?.length === 0 && <NoDataFound />}
      {Boolean(data?.length) && <ProductsCarousel data={data} />}

      <Dialog
        open={Boolean(product)}
        onClose={() => setProduct(false)}
        maxWidth="md"
        TransitionComponent={Transition}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              {product && <DialogCarousel product={product} isDialog />}
            </Grid>
            <Grid item xs={12} md={7}>
              {product && (
                <ProductDetailsSumary
                  product={product}
                  isLoading={isLoading || loading}
                  isDialog
                  unitRate={unitRate}
                  symbol={symbol}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </RootStyled>
  );
}
