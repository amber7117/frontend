import dynamic from "next/dynamic";
import { useState, forwardRef } from "react";

// material
import { Box, Grid } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import Fade from "@mui/material/Fade";
import { TransitionProps } from "@mui/material/transitions";
// no data
import NoDataIllustration from "src/components/illustrations/noDataFound/noDataFound";
// components
import { useSelector } from "react-redux";
import _ from "lodash";
const ProductDetailsSumary = dynamic(
  () => import("src/components/_main/productDetails/summary")
);
const ProductVariantsSumary = dynamic(
  () => import("src/components/_main/productDetails/variantsSummary")
);

const DialogCarousel = dynamic(
  () => import("src/components/carousels/detailsCarousel/detailsCarousel")
);
const ShopProductCard = dynamic(
  () => import("src/components/cards/productCard")
);

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

export default function ProductList({ ...props }) {
  const { data, isLoading, isMobile } = props;
  const { symbol, unitRate } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const [product, setProduct] = useState(null);
  const products = data?.data;

  return (
    <Box my={3}>
      <Grid container spacing={isMobile ? 1 : 2}>
        {!isLoading && products?.length < 1 && <NoDataIllustration />}
        {(isLoading ? Array.from(new Array(9)) : products)?.map(
          (product: any) => (
            <Grid
              key={Math.random()}
              item
              lg={4}
              md={4}
              sm={4}
              xs={6}
              sx={{ transition: "all 0.3s ease-in-out" }}>
              <ShopProductCard
                product={product}
                loading={isLoading}
                isMobile={isMobile}
                symbol={symbol}
                unitRate={unitRate}
                onClickCart={() => (isLoading ? null : setProduct(product))}
              />
            </Grid>
          )
        )}
        <Dialog
          open={Boolean(product)}
          onClose={() => setProduct(null)}
          TransitionComponent={Transition}
          maxWidth="md"
          sx={{
            "& .MuiDialog-paper": {
              width: "100%",
              margin: 0,
            },
          }}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={6}>
                {product && <DialogCarousel product={product} isDialog />}
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <ProductDetailsSumary
                  product={product}
                  isLoading={isLoading}
                  isDialog
                  unitRate={unitRate}
                  symbol={symbol}
                />
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    </Box>
  );
}
