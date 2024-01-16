import * as React from "react";
import Dialog from "@mui/material/Dialog";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Search from "./search";
export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <SearchIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiPaper-root": { width: 600 } }}
      >
        <Search onClose={handleClose} />
      </Dialog>
    </>
  );
}
