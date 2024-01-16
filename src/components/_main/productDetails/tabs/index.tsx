import { useState, SyntheticEvent } from "react";
import dynamic from "next/dynamic";
// material
import { styled } from "@mui/material/styles";
import { Box, Tab, Card, Divider, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import Page from "src/components/page";
import useTranslation from "next-translate/useTranslation";

const ProductDetailsReview = dynamic(() => import("../reviews"));
const RootStyles = styled(Page)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  padding: "40px 0",
  backgroundColor: theme.palette.background.paper,
}));

export default function EcommerceProductDetails({ ...props }) {
  const { product, reviews, totalRating, totalReviews, reviewsSummery } = props;
  const { t } = useTranslation("details");
  const [value, setValue] = useState("1");
  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <RootStyles>
      <Card sx={{ mb: 3 }}>
        <TabContext value={value}>
          <Box sx={{ px: 3, bgcolor: "background.neutral" }}>
            <TabList onChange={handleChangeTab}>
              <Tab disableRipple value="1" label={t("product-description")} />
              <Tab
                disableRipple
                value="2"
                label={t("reviews")}
                sx={{ "& .MuiTab-wrapper": { whiteSpace: "nowrap" } }}
              />
            </TabList>
          </Box>
          <Divider />
          <TabPanel value="1" sx={{ p: 3 }}>
            <Typography variant="body1" color="text.secondary">
              {product?.description}
            </Typography>
          </TabPanel>
          <TabPanel value="2">
            <ProductDetailsReview
              reviewsSummery={reviewsSummery}
              totalRating={totalRating}
              totalReviews={totalReviews}
              reviews={reviews}
              pid={product?._id}
            />
          </TabPanel>
        </TabContext>
      </Card>
    </RootStyles>
  );
}
