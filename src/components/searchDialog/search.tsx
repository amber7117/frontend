import * as React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import { alpha } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import { InputAdornment } from "@mui/material";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { NoDataFound } from "src/components/illustrations";
import CircularProgress from "@mui/material/CircularProgress";
import { useMutation } from "react-query";
import * as api from "src/services";
// redux

Search.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default function Search({ ...props }) {
  const { onClose, mobile } = props;

  const [state, setstate] = React.useState({
    products: [],
    categories: [],
    brands: [],
  });
  const [loading, setLoading] = React.useState(true);

  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const { mutate, isLoading } = useMutation("search", api.search, {
    onSuccess: (data) => {
      setLoading(false);
      setstate({ ...data });
    },
  });

  const [focus, setFocus] = React.useState(true);

  const handleListItemClick = (slug: string, type: string) => {
    !mobile && onClose(slug);
    router.push(
      type === "brand"
        ? `/products?brand=${slug}`
        : type === "category"
        ? `/products/${slug}`
        : `/product/${slug}`
    );
  };
  const onKeyDown = (e: any) => {
    if (e.keyCode == "38" || e.keyCode == "40") {
      setFocus(false);
    }
  };
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      mutate({ query: search });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <TextField
        id="standard-basic"
        variant="standard"
        autoFocus
        onFocus={() => setFocus(true)}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ justifyContent: "center" }}>
              {isLoading ? (
                <CircularProgress
                  sx={{ width: "24px !important", height: "24px !important" }}
                />
              ) : (
                <SearchIcon />
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          ...(mobile && {
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
          }),
          "& .MuiInput-root": {
            height: { lg: 72, md: 72, sm: 72, xs: 56 },
          },
          "& .MuiInputAdornment-root": {
            width: 100,
            mr: 0,
            svg: {
              mx: "auto",
              color: "primary.main",
            },
          },
        }}
      />
      <Box className="scroll-main">
        <Box sx={{ height: mobile ? "auto" : "400px", overflow: "auto" }}>
          {!loading &&
            !Boolean(state.products.length) &&
            !Boolean(state.categories.length) &&
            !Boolean(state.brands.length) && <NoDataFound />}

          <>
            <>
              <MenuList
                sx={{
                  pt: 0,
                  overflow: "auto",
                  px: 1,
                  li: {
                    borderRadius: "4px",
                    border: `1px solid transparent`,
                    "&:hover, &.Mui-focusVisible, &.Mui-selected ": {
                      border: (theme) =>
                        `1px solid ${theme.palette.primary.main}`,
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.16),
                      h6: {
                        color: "primary.main",
                      },
                    },
                  },
                }}
                autoFocusItem={!focus}>
                {!isLoading && !Boolean(state.brands.length) ? (
                  ""
                ) : (
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    p={2}
                    textTransform="uppercase">
                    {isLoading ? (
                      <Skeleton variant="text" width={150} />
                    ) : (
                      "brands"
                    )}
                  </Typography>
                )}

                {(isLoading
                  ? Array.from(new Array(mobile ? 4 : 2))
                  : state.brands
                ).map((brand) => (
                  <MenuItem
                    key={brand?.id}
                    onClick={() => handleListItemClick(brand?.slug, "brand")}>
                    <ListItemIcon>
                      {isLoading ? (
                        <Skeleton variant="circular" width={40} height={40} />
                      ) : (
                        <Avatar alt={brand.name} src={brand.logo.url} />
                      )}
                    </ListItemIcon>
                    <ListItemText>
                      <Typography
                        variant="subtitle1"
                        color="text.primary"
                        noWrap>
                        {isLoading ? <Skeleton variant="text" /> : brand.name}
                      </Typography>
                    </ListItemText>
                  </MenuItem>
                ))}
              </MenuList>
            </>
            {!isLoading && !Boolean(state.categories.length) ? (
              ""
            ) : (
              <>
                <MenuList
                  sx={{
                    pt: 0,
                    overflow: "auto",
                    px: 1,
                    li: {
                      borderRadius: "4px",
                      border: `1px solid transparent`,
                      "&:hover, &.Mui-focusVisible, &.Mui-selected ": {
                        border: (theme) =>
                          `1px solid ${theme.palette.primary.main}`,
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.16),
                        h6: {
                          color: "primary.main",
                        },
                      },
                    },
                  }}
                  autoFocusItem={!focus}>
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    p={2}
                    textTransform="uppercase">
                    {isLoading ? (
                      <Skeleton variant="text" width={150} />
                    ) : (
                      "categories"
                    )}
                  </Typography>
                  {(isLoading
                    ? Array.from(new Array(mobile ? 4 : 2))
                    : state.categories
                  ).map((category) => (
                    <MenuItem
                      key={category?.id}
                      onClick={() =>
                        handleListItemClick(category?.slug, "category")
                      }>
                      <ListItemIcon>
                        {isLoading ? (
                          <Skeleton variant="circular" width={40} height={40} />
                        ) : (
                          <Avatar
                            alt={category.name}
                            src={category.cover.url}
                          />
                        )}
                      </ListItemIcon>
                      <ListItemText>
                        <Typography
                          variant="subtitle1"
                          color="text.primary"
                          noWrap>
                          {isLoading ? (
                            <Skeleton variant="text" />
                          ) : (
                            category.name
                          )}
                        </Typography>
                      </ListItemText>
                    </MenuItem>
                  ))}
                </MenuList>
              </>
            )}
            {!isLoading && !Boolean(state.products.length) ? (
              ""
            ) : (
              <>
                <MenuList
                  sx={{
                    pt: 0,
                    overflow: "auto",
                    px: 1,
                    li: {
                      borderRadius: "4px",
                      border: `1px solid transparent`,
                      "&:hover, &.Mui-focusVisible, &.Mui-selected ": {
                        border: (theme) =>
                          `1px solid ${theme.palette.primary.main}`,
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.16),
                        h6: {
                          color: "primary.main",
                        },
                      },
                    },
                  }}
                  autoFocusItem={!focus}>
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    p={2}
                    textTransform="uppercase">
                    {isLoading ? (
                      <Skeleton variant="text" width={150} />
                    ) : (
                      "Products"
                    )}
                  </Typography>
                  {(isLoading
                    ? Array.from(new Array(mobile ? 4 : 2))
                    : state.products
                  ).map((product) => (
                    <MenuItem
                      key={product?.id}
                      onClick={() =>
                        handleListItemClick(product?.slug, "product")
                      }>
                      <ListItemIcon>
                        {isLoading ? (
                          <Skeleton variant="circular" width={40} height={40} />
                        ) : (
                          <Avatar alt={product.name} src={product.cover} />
                        )}
                      </ListItemIcon>
                      <ListItemText>
                        <Typography
                          variant="subtitle1"
                          color="text.primary"
                          noWrap>
                          {isLoading ? (
                            <Skeleton variant="text" />
                          ) : (
                            product.name
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap>
                          {isLoading ? (
                            <Skeleton variant="text" />
                          ) : (
                            product.category?.name
                          )}
                        </Typography>
                      </ListItemText>
                    </MenuItem>
                  ))}
                </MenuList>
              </>
            )}
          </>
        </Box>
      </Box>
    </>
  );
}
