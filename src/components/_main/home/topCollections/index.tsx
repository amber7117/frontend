// react
import React from "react";
import { useSelector } from "react-redux";

// next
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// material
import {
  Typography,
  Grid,
  Button,
  Dialog,
  DialogContent,
  Fade,
} from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { TransitionProps } from "@mui/material/transitions";

// components
import { NoDataFound } from "src/components";

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

import RootStyled from "./styled";

// ----------------------------------------------------------------------
const ProductCard = dynamic(() => import("src/components/cards/productCard"));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

export default function EcommerceShop({ ...props }) {
  const { data, t } = props;
  const { push } = useRouter();
  const isLoading = !data;
  const { symbol, unitRate } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const onClickLink = () => {
    push(`/products?top=-1`);
  };
  React.useEffect(() => {
    if (data) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RootStyled>
      <Typography variant="h2" color="text.primary" className="heading">
        {t("top-collections")}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        className="description">
        {t("lorem-ipsum")}
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {!isLoading && data?.length < 1 && (
          <Grid item md={12}>
            <NoDataFound />
          </Grid>
        )}

        {data?.map((item: any, index: number) => (
          <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
            <ProductCard
              product={item}
              loading={false}
              isLoaded={!loading}
              loadingRedux={isLoading}
              symbol={symbol}
              unitRate={unitRate}
              onClickCart={() =>
                isLoading ? setProduct(null) : setProduct(item)
              }
            />
          </Grid>
        ))}
      </Grid>
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
                  isLoading={isLoading}
                  isDialog
                  unitRate={unitRate}
                  symbol={symbol}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Button
        variant="text"
        color="primary"
        endIcon={<ArrowForwardIosRoundedIcon fontSize="small" />}
        className="view-button"
        onClick={onClickLink}>
        {t("view-all")}
      </Button>
    </RootStyled>
  );
}
