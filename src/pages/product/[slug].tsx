import React, { useState } from "react";
// material
import { alpha, styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import {
  Box,
  Card,
  Grid,
  Container,
  Typography,
  Skeleton,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";

// components
import { paramCase } from "change-case";
import { useRouter } from "next/navigation";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import { Page } from "src/components";

import useTranslation from "next-translate/useTranslation";
import { useSelector } from "react-redux";
import Reviews from "models/Reviews";
import Users from "models/Users";
import Brands from "models/Brands";
import Categories from "models/Categories";
import ProductDetailsSumary from "src/components/_main/productDetails/summary";

// dynamic import

const ProductDetailsCarousel = dynamic(
  () => import("src/components/carousels/detailsCarousel/detailsCarousel")
);

const ProductDetailsTabs = dynamic(
  () => import("src/components/_main/productDetails/tabs")
);
const RelatedProductsCarousel = dynamic(
  () => import("src/components/_main/productDetails/relatedProducts")
);

// ----------------------------------------------------------------------

const PRODUCT_DESCRIPTION = [
  {
    title: "100%-original",
    icon: <VerifiedRoundedIcon sx={{ fontSize: 36 }} />,
  },
  {
    title: "10-day-replacement",
    icon: <AccessTimeRoundedIcon sx={{ fontSize: 36 }} />,
  },
  {
    title: "1-year-warranty",
    icon: <VerifiedUserRoundedIcon sx={{ fontSize: 36 }} />,
  },
];

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  justifyContent: "center",
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

const RootStyles = styled(Page)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  padding: "40px 0",

  backgroundColor: theme.palette.background.paper,
}));

export default function EcommerceProductDetails({ ...props }) {
  const {
    data: product,
    reviews,
    totalRating,
    totalReviews,
    reviewsSummery,
    relatedProducts,
    category,
    brand,
  } = props;

  const { t } = useTranslation("details");
  const router = useRouter();
  const { unitRate, symbol } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const isLoading = !product;

  return (
    <RootStyles
      title={product?.name + " | GOGOGM"}
      description={product?.description + " | " + "GOGOGM"}
      images={[
        {
          url: product?.cover,
          width: 800,
          height: 600,
          alt: product?.name,
        },
      ]}
      canonical={"product/" + product?.slug}>
      <Container>
        <>
          <Card
            sx={{
              p: 2,
              mt: 4,
              borderWidth: 0,
              bgcolor: "background.paper",
              mb: 3,
            }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={8} md={6} lg={6}>
                <ProductDetailsCarousel
                  isLoading={isLoading}
                  product={product}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <ProductDetailsSumary
                  isLoading={isLoading}
                  id={product?._id}
                  product={product}
                  brand={brand}
                  category={category}
                  totalRating={totalRating || 0}
                  totalReviews={totalReviews || 0}
                  unitRate={unitRate}
                  symbol={symbol}
                />
              </Grid>
            </Grid>
          </Card>
          <ProductDetailsTabs
            totalRating={totalRating}
            totalReviews={totalReviews || 0}
            reviews={reviews}
            product={product}
            reviewsSummery={reviewsSummery}
          />
          <Grid container spacing={3}>
            {PRODUCT_DESCRIPTION.map((item) => (
              <Grid item xs={12} md={4} key={item.title}>
                <Card sx={{ borderRadius: "8px", width: "100%", py: 2 }}>
                  <Box
                    sx={{
                      my: 2,
                      mx: "auto",
                      maxWidth: 280,
                      textAlign: "center",
                    }}>
                    <IconWrapperStyle>{item.icon}</IconWrapperStyle>
                    <Typography variant="subtitle1" gutterBottom>
                      {t(item.title)}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>

        <RelatedProductsCarousel data={relatedProducts} id={product?._id} />
      </Container>
      <Box py={2} />
    </RootStyles>
  );
}

export const getStaticPaths = async () => {
  await dbConnect();
  const products = await Products.find({});
  const paths = products.map((product) => ({
    params: { slug: product.slug },
  }));
  return { paths, fallback: "blocking" };
};
export const getStaticProps = async ({ ...props }) => {
  await dbConnect();
  const { params } = props;

  const product = await Products.findOne({
    slug: params.slug,
  });
  if (!product) {
    return {
      notFound: true,
    };
  }
  const category = await Categories.findOne({
    _id: product.category,
  }).select(["name"]);
  const brand = await Brands.findOne({
    _id: product.brand,
  }).select(["name"]);
  await Users.findOne();
  const reviews = await Reviews.find({
    product: product._id,
  })
    .sort({
      createdAt: -1,
    })
    .populate("user")
    .exec();

  const related = await Products.find(
    {
      category: product.category,
      _id: { $ne: product._id },
    },
    null,
    {
      limit: 12,
    }
  );
  const getProductRatingAndReviews = () => {
    return Products.aggregate([
      {
        $match: { slug: params.slug },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "product",
          as: "reviews",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          rating: { $avg: "$reviews.rating" },
          totalReviews: { $size: "$reviews" },
        },
      },
    ]);
  };
  const getProductReviewCounts = () => {
    return Products.aggregate([
      {
        $match: { slug: params.slug },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "product",
          as: "reviews",
        },
      },
      {
        $unwind: "$reviews",
      },
      {
        $group: {
          _id: "$reviews.rating",
          count: { $sum: 1 },
        },
      },
    ]);
  };

  const reviewsSummery = await getProductReviewCounts();
  // Usage

  const reviewReport = await getProductRatingAndReviews();

  return {
    props: {
      data: JSON.parse(JSON.stringify(product)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      relatedProducts: JSON.parse(JSON.stringify(related)),
      totalRating: JSON.parse(JSON.stringify(reviewReport[0]?.rating)),
      totalReviews: JSON.parse(JSON.stringify(reviewReport[0]?.totalReviews)),
      reviewsSummery: JSON.parse(JSON.stringify(reviewsSummery)),
      brand: JSON.parse(JSON.stringify(brand)),
      category: JSON.parse(JSON.stringify(category)),
    },
    revalidate: 200,
  };
};
