import Brands from "models/Brands";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { isString } from "lodash";
import Products from "models/Products";
import dbConnect from "lib/dbConnect";
import useTranslation from "next-translate/useTranslation";
// material
import { Box, Stack, Drawer, Card } from "@mui/material";
import { useMediaQuery, IconButton, Typography, Skeleton } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

// components
import { Page } from "src/components";

// api
import * as api from "src/services";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import Filter from "src/components/_main/products/filter";

const Pagination = dynamic(() => import("src/components/pagination"));
const ProductList = dynamic(
  () => import("src/components/_main/products/productList")
);

const sortData = [
  { title: "top-rated", key: "top", value: -1 },
  { title: "asceding", key: "name", value: 1 },
  { title: "desceding", key: "name", value: -1 },
  { title: "Price-low-high", key: "price", value: 1 },
  { title: "Price-high-low", key: "price", value: -1 },
  { title: "oldest", key: "date", value: 1 },
  { title: "newest", key: "date", value: -1 },
];

export default function Listing({ ...props }) {
  const { category, ...filteres } = props;
  const { t } = useTranslation("listing");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { unitRate } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const [sort, setSort] = useState<any>(null);
  const [itemsPerPage, setItemsPerPage] = useState("12");

  // 构建查询参数
  const buildQueryString = () => {
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    params.append('unit', unitRate);
    return params.toString();
  };

  const { data, isLoading } = useQuery(
    ["product", buildQueryString()],
    () => api.getProducts(`?${buildQueryString()}`)
  );

  const handleChange = (event: any) => {
    const filtered: any = sortData.find(
      (item) => item.title === event.target.value
    );

    if (sort) {
      const sortedData = sortData.find((item) => item.title === sort);
      const key: string | undefined = sortedData?.key;
      
      // 创建新的URLSearchParams
      const newParams = new URLSearchParams(searchParams.toString());
      if (key) {
        newParams.delete(key);
      }
      newParams.set(filtered.key, filtered.value.toString());
      
      // 更新URL
      router.push(`?${newParams.toString()}`);
      setSort(filtered.title);
    } else {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set(filtered.key, filtered.value.toString());
      router.push(`?${newParams.toString()}`);
      setSort(filtered.title);
    }
  };

  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    const limit = searchParams.get('limit');
    const name = searchParams.get('name');
    const date = searchParams.get('date');
    const price = searchParams.get('price');

    setItemsPerPage(isString(limit) ? limit : "12");
    setSort(
      name === "1"
        ? "asceding"
        : name === "-1"
        ? "desceding"
        : date === "1"
        ? "oldest"
        : date === "-1"
        ? "newest"
        : price === "1"
        ? "Price-low-high"
        : price === "-1"
        ? "Price-high-low"
        : "top-rated"
    );
  }, [searchParams]);

  const page = searchParams.get('page');

  return (
    <Page
      title={"Products | GOGOGM"}
      description="gogogm是备受全球华人信赖的线上游戏点卡，手游和直播充值平台。为全球玩家提供各种最新游戏、手游充值，游戏充值，、直播充值，游戏点卡、游戏激活码、充值卡等。可使用PayPal, 信用卡，网银，各国电子钱包支付。马上到GOGOGM购买吧！"
      canonical={"products"}>
      <Box sx={{ bgcolor: "background.default" }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid
              item
              md={3}
              xs={0}
              sx={{
                ...(isMobile && {
                  display: "none",
                }),
              }}>
              <Filter filteres={filteres} t={t} />
            </Grid>
            <Grid item md={9} xs={12}>
              <Stack
                pt={2}
                alignItems="center"
                justifyContent={"space-between"}
                sx={{
                  flexDirection: { md: "row", xs: "column-reverse" },
                  button: {
                    mr: 1,
                    borderRadius: "4px",
                    "&.active": {
                      svg: {
                        color: "primary.main",
                      },
                    },
                    boxShadow:
                      "0px 10px 32px -4px rgba(19, 25, 39, 0.10), 0px 6px 14px -6px rgba(19, 25, 39, 0.12)",
                  },
                  fieldset: {
                    border: "none",
                    boxShadow:
                      "0px 10px 32px -4px rgba(19, 25, 39, 0.10), 0px 6px 14px -6px rgba(19, 25, 39, 0.12)",
                  },
                }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mt: { md: 0, xs: 1.5 },
                    fontSize: {
                      sm: "1rem",
                      xs: "12px",
                    },
                  }}>
                  {isLoading ? (
                    <Skeleton variant="text" width={200} />
                  ) : (
                    data?.total !== 0 && (
                      <>
                        {t("showing")}{" "}
                        {page
                          ? `${
                              (Number(page) - 1) *
                                Number(itemsPerPage) +
                              1
                            }`
                          : 1}
                        -
                        {data?.total <
                        Number(itemsPerPage) * (Number(page) || 1)
                          ? data?.total
                          : Number(itemsPerPage) *
                            (Number(page) || 1)}{" "}
                        {t("of")} {data?.total} {t("items")}
                      </>
                    )
                  )}
                </Typography>
                <Stack direction="row" gap={1} alignItems="center">
                  <IconButton
                    onClick={() => setOpenDrawer(true)}
                    sx={{
                      display: { md: "none", xs: "flex" },
                      bgcolor: "background.paper",
                    }}
                    size="small">
                    <TuneRoundedIcon />
                  </IconButton>
                  <FormControl
                    size="small"
                    fullWidth
                    sx={{
                      minWidth: 150,
                      fieldset: {
                        border: "none",
                      },
                    }}>
                    {sort || sort === "" ? (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        onChange={handleChange}>
                        {sortData.map((item) => (
                          <MenuItem key={Math.random()} value={item.title}>
                            {t(item.title)}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <Skeleton variant="rounded" width={150} height={40} />
                    )}
                  </FormControl>
                  <FormControl size="small" fullWidth sx={{ maxWidth: 150 }}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(e.target.value);
                        const newParams = new URLSearchParams(searchParams.toString());
                        newParams.set('limit', e.target.value);
                        router.push(`?${newParams.toString()}`);
                      }}
                      sx={{
                        "& .MuiSelect-select": {
                          textTransform: "capitalize",
                        },
                      }}>
                      {["12", "18", "24", "30"].map((item) => (
                        <MenuItem
                          key={Math.random()}
                          value={item}
                          sx={{
                            textTransform: "capitalize",
                          }}>
                          {t("show")}: {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
              <ProductList
                data={data}
                isLoading={isLoading}
                isMobile={isMobile}
              />
              {!isLoading && <Pagination data={data} />}
            </Grid>
          </Grid>
        </Container>
        <Drawer
          anchor={"right"}
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}>
          <Filter
            filteres={filteres}
            isMobile
            onClose={() => setOpenDrawer(false)}
          />
        </Drawer>
      </Box>
    </Page>
  );
}

export const getStaticProps = async ({ ...props }) => {
  await dbConnect();

  // ______________________________________________________

  const totalProducts = await Products.find({
    status: { $ne: "disabled" },
  }).select(["variants", "gender"]);
  const brands = await Brands.find({
    status: { $ne: "disabled" },
  }).select(["name", "slug"]);

  const total: any = totalProducts.map((item) => item.gender);
  const totalGender: any = total.filter((item: any) => item !== "");

  function onlyUnique(value: string, index: number, array: string[]) {
    return array.indexOf(value) === index;
  }
  const mappedColors = totalProducts?.map((v) =>
    v.variants.map(({ color }: any) => color)
  );
  const mappedSizes = totalProducts?.map((v) =>
    v.variants.map(({ size }: any) => size)
  );
  const mappedPrices = totalProducts?.map((v) =>
    v.variants.map(({ price }: any) => price)
  );
  const min = mappedPrices[0] ? Math.min(...mappedPrices[0]) : 0;
  const max = mappedPrices[0] ? Math.max(...mappedPrices[0]) : 100000;

  return {
    props: {
      colors: JSON.parse(JSON.stringify(_.union(...mappedColors))),
      sizes: JSON.parse(JSON.stringify(_.union(...mappedSizes))),
      prices: JSON.parse(JSON.stringify([min, max])),
      genders: JSON.parse(JSON.stringify(totalGender.filter(onlyUnique))),
      brands: JSON.parse(JSON.stringify(brands)),
    },
    revalidate: 200,
  };
};
