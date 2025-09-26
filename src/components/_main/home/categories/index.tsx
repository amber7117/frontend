// react
import React, { useState, useEffect } from "react";
// next
import dynamic from "next/dynamic";
// material
import {
  Typography,
  Grid,
  Box,
  Button,
  Zoom,
  Stack,
  IconButton,
} from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

// styles
import RootStyled from "./styled";

// dynamic import
const CategoryCard = dynamic(() => import("src/components/cards/category"));
import { NoDataFound } from "src/components";
import { useRouter } from "next/navigation";

export default function Categories({ ...props }) {
  const { categories, t } = props;
  const router = useRouter();
  const [state, setState] = useState<number | null>(null);

  return (
    <RootStyled>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        className="stack">
        <Typography variant="h2" color="text.primary" className="heading">
          {t("categories")}
        </Typography>
      </Stack>
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        className="description">
        {t("lorem-ipsum")}
      </Typography>

      {categories.length < 1 && <NoDataFound />}
      <Box>
        {state !== null && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            mb={3}
            spacing={1}>
            <Zoom in={state !== null}>
              <IconButton
                className="back-button"
                size="small"
                color="inherit"
                onClick={() => setState(null)}>
                <ArrowBackIosRoundedIcon fontSize="small" />
              </IconButton>
            </Zoom>
            <Typography variant="subtitle1">
              {categories[state]?.name}
            </Typography>
          </Stack>
        )}
        {state !== null && (
          <Grid container spacing={2} justifyContent="center">
            {(categories[state]?.subCategories || []).map((inner: any) => (
              <React.Fragment key={Math.random()}>
                <Grid item lg={2} md={3} sm={4} xs={4}>
                  <CategoryCard
                    state={state}
                    onClickCard={() => setState(null)}
                    isLoading={false}
                    category={inner}
                    parent={categories[state]}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        )}
      </Box>
      <Box>
        {state === null && (
          <Grid container spacing={2} justifyContent="center">
            {categories.map((inner: any, i: number) => (
              <React.Fragment key={Math.random()}>
                <Grid item lg={2} md={3} sm={4} xs={4}>
                  <CategoryCard
                    totalItems={inner?.subCategories.length}
                    state={state}
                    onClickCard={() =>
                      inner.subCategories?.length
                        ? setState(i)
                        : router.push(`products/${inner.slug}`)
                    }
                    isLoading={false}
                    category={inner}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        )}
      </Box>
    </RootStyled>
  );
}
