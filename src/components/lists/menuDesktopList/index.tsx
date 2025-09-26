import React, { useState } from "react";
// next
import { useRouter } from "next/navigation";
// components
import RootStyled from "./styled";
// material
import { Box, ListSubheader, ListItem, Skeleton } from "@mui/material";

function IconBullet({ type = "item" }) {
  return (
    <Box className="icon-bullet-main">
      <Box
        component="span"
        className={`icon-bullet-inner ${type !== "item" && "active"}`}
      />
    </Box>
  );
}

export default function MenuDesktopList({ ...props }) {
  const { isLoading, parent, onClose } = props;
  const { push } = useRouter();
  // const [state, setstate] = useState(true);

  // setTimeout(() => {
  //   setstate(false);
  // }, 5000);

  return (
    <RootStyled disablePadding>
      <>
        <ListSubheader
          disableSticky
          disableGutters
          className="list-subheader"
          onClick={() => {
            onClose();
            push("/products/" + parent?.slug);
          }}>
          {isLoading ? <Skeleton variant="text" width={160} /> : parent?.name}
        </ListSubheader>
        {(isLoading ? Array.from(new Array(5)) : parent?.subCategories).map(
          (subCategory: any) => (
            <React.Fragment key={Math.random()}>
              <ListItem
                // key={Math.random()}
                className="list-item"
                onClick={() => {
                  onClose();
                  push(`/products/${parent?.slug}/${subCategory?.slug}`);
                }}>
                {isLoading ? (
                  <Skeleton
                    variant="circular"
                    width={16}
                    className="circular-sekelton"
                    sx={{
                      mr: 1.5,
                    }}
                  />
                ) : (
                  <IconBullet />
                )}
                {isLoading ? (
                  <Skeleton variant="text" width={160} />
                ) : (
                  subCategory?.name
                )}
              </ListItem>
            </React.Fragment>
          )
        )}
      </>
    </RootStyled>
  );
}
