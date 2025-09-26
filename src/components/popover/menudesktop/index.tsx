import React from "react";

// material
import { Box, Grid } from "@mui/material";

// components
import MenuDesktopList from "src/components/lists/menuDesktopList";
import MenuPopover from "src/components/popover/popover";

export default function MenuDesktop({ ...props }) {
  const { isOpen, scrollPosition, onClose, isLoading, data } = props;

  return (
    <MenuPopover
      open={isOpen}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: scrollPosition > 29 ? 80 : 80 - scrollPosition,
        left: 0,
      }}
      isDesktop
      sx={{
        display: "block!important",
      }}>
      <Grid container spacing={2}>
        {(isLoading ? Array.from(new Array(3)) : data)?.map((parent: any) => {
          return (
            <Grid item lg={2} key={Math.random()}>
              <MenuDesktopList
                parent={parent}
                isLoading={isLoading}
                onClose={onClose}
              />
            </Grid>
          );
        })}
      </Grid>
    </MenuPopover>
  );
}
