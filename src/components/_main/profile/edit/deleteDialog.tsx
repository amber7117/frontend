import React from "react";
// material
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { LoadingButton } from "@mui/lab";
import { useMutation } from "react-query";
import * as api from "src/services";
// redux
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";

export default function DeleteDialog({ ...props }) {
  const { onClose, id, apicall } = props;
  const [loading, setloading] = React.useState(false);
  const { t } = useTranslation("profile");
  const { user } = useSelector(({ user }: { user: any }) => user);
  const { mutate } = useMutation(api.deleteAddress, {
    onSuccess: (data) => {
      setloading(false);
      onClose();
      const { message } = data;
      toast.success(t(message));
    },
  });
  const handleDelete = async () => {
    setloading(true);
    const data = {
      id: user._id,
      _id: id,
    };
    await mutate(data);
    apicall((prev: any) => ({ ...prev, apicall: !prev.apicall }));
  };
  return (
    <>
      <DialogTitle sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
        <WarningRoundedIcon sx={{ mr: 1 }} /> Warning
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this Address?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={handleDelete}>
          Delete
        </LoadingButton>
      </DialogActions>
    </>
  );
}
