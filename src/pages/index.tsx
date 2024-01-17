import React from "react";

// next
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import type { InferGetStaticPropsType } from "next";
import BlurImage from "src/components/blurImage";
import Image from "next/image";

// mongoose models
import dbConnect from "lib/dbConnect";
import HomeSlider from "models/HomeSlider";
import Brands from "models/Brands";
import Products from "models/Products";
import ReadData from 'src/components/ReadData2';


import HomeBanners from "models/HomeBanners";

// material
import { Container } from "@mui/material/";

// skeletons
import HeroCarouselSkeleton from "src/components/skeletons/home/heroCarousel";
import BannersSkeleton from "src/components/skeletons/home/bannersSkeleton";
import { Page } from "src/components";
import SubCategories from "models/SubCategories";
import CategoriesModel from "models/Categories";
// dynamic import
const HeroCarousel = dynamic(
  () => import("src/components/carousels/heroCarousel/heroCarousel"),
  {
    loading: () => <HeroCarouselSkeleton />,
  }
);
const Banners = dynamic(() => import("src/components/_main/home/banners"), {
  loading: () => <BannersSkeleton />,
});
const Categories = dynamic(
  () => import("src/components/_main/home/categories")
);
const TopCollections = dynamic(
  () => import("src/components/_main/home/topCollections")
);
const CenteredBanner = dynamic(
  () => import("src/components/_main/home/centeredBanner")
);
import FeaturedProducts from "src/components/_main/home/featured";

const WhyUs = dynamic(() => import("src/components/_main/home/whyUs"));
const BrandsMain = dynamic(() => import("src/components/_main/home/brands"));

export const getStaticProps = async () => {
  await dbConnect();
  const slides = await HomeSlider.find();
  const brands = await Brands.find();
  const homeBanners = await HomeBanners.find({});
  await SubCategories.findOne();
  const categories = await CategoriesModel.find({}).populate("subCategories");

  const featuredProducts = await Products.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "_id",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: { $avg: "$reviews.rating" },
      },
    },
    {
      $match: {
        isFeatured: true,
      },
    },
    {
      $limit: 12,
    },
  ]);
  const topRatedProducts = await Products.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "_id",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: { $avg: "$reviews.rating" },
      },
    },
    {
      $sort: {
        averageRating: -1,
      },
    },
    {
      $limit: 8,
    },
  ]);

  return {
    props: {
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      slidesData: JSON.parse(JSON.stringify(slides)),
      brandData: JSON.parse(JSON.stringify(brands)),
      topRatedProducts: JSON.parse(JSON.stringify(topRatedProducts)),
      homeBanners: JSON.parse(JSON.stringify(homeBanners)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
    revalidate: 60,
  };
};

export default function Home({
  featuredProducts,
  slidesData,
  brandData,
  topRatedProducts,
  homeBanners,
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("home");

  return (
    <Page
      title="全球华人首选线上游戏点卡, 购物礼品卡, 手游和直播充值直充平台"
      description="gogogm是备受全球华人信赖的线上游戏点卡，手游和直播充值平台。为全球玩家提供各种最新游戏、手游充值，游戏充值，、直播充值，游戏点卡、游戏激活码、充值卡等。可使用PayPal, 信用卡，网银，各国电子钱包支付。马上到GOGOGM购买吧！"
      canonical="">
      <HeroCarousel isLoading={!slidesData} data={slidesData} />
      <Banners data={homeBanners} />
      <Container>
        <Categories categories={categories} t={t} />
         <ReadData />
        {/*<TopCollections data={topRatedProducts} t={t} /> */}
        {/* <CenteredBanner data={homeBanners} /> */}
        {/*<FeaturedProducts data={featuredProducts} t={t} />*/}
        {/*<BrandsMain data={brandData} />*/}
       
      </Container>
    </Page>
  );
}
