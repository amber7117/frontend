import React from "react";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { useFormik, Form, FormikProvider } from "formik";
// material
import { styled } from "@mui/material/styles";
import {
  Button,
  TextField,
  Typography,
  FormHelperText,
  Stack,
  Rating,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// utils
import { useMutation } from "react-query";
import * as api from "src/services";
import axios from "axios";

import useTranslation from "next-translate/useTranslation";
import { toast } from "react-hot-toast";
const UploadMultiFile = dynamic(
  () => import("src/components/upload/UploadMultiFile")
);
// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  //   borderRadius: theme.shape.borderRadiusMd,
  borderRadius: "8px",
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

ProductDetailsReviewForm.propTypes = {
  onClose: PropTypes.func,
};

export default function ProductDetailsReviewForm({ ...props }) {
  const { onClose, pid, onClickCancel, onAddingReview, ...other } = props;
  const { t } = useTranslation("details");
  const [loading, setloading] = React.useState(false);
  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error: any) => {
      toast.error(t("common:" + error.message));
    },
  });
  const ReviewSchema = Yup.object().shape({
    rating: Yup.mixed().required("Rating is required"),
    review: Yup.string().required("Review is required"),
  });

  const formik = useFormik({
    initialValues: {
      rating: null,
      review: "",
      images: [],
      blob: [],
    },
    validationSchema: ReviewSchema,
    onSubmit: async () => {
      mutate({
        rating: values.rating,
        review: values.review,
        images: values.images.map((v: any) => v.url),
        product: pid,
      });
    },
  });

  const {
    values,
    errors,
    touched,
    resetForm,
    handleSubmit,
    setFieldValue,
    getFieldProps,
  } = formik;
  const { mutate, isLoading } = useMutation(api.addReview, {
    onSuccess: ({ data, user }) => {
      onAddingReview({ ...data, user });
      toast.success(t("common:added-review"));
      resetForm();
      onClose();
    },
  });
  const onCancel = () => {
    onClickCancel();
    resetForm();
  };
  const handleDrop = (acceptedFiles: any) => {
    setloading(true);
    const uploaders = acceptedFiles.map((file: any) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my-uploads");
      setFieldValue("blob", values.blob.concat(acceptedFiles));
      // ${process.env.CLOUDINARY_CLOUD_NAME}
      return axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
    });
    const blobs = acceptedFiles.map((file: any) => {
      return URL.createObjectURL(file);
    });
    axios.all(uploaders).then((data: any) => {
      const newImages = data.map(({ data }: { data: any }, i: number) => ({
        url: data.secure_url,
        _id: data.public_id,
        blob: blobs[i],
      }));
      setloading(false);
      setFieldValue("images", values.images.concat(newImages));
    });
  };

  const handleRemoveAll = () => {
    values.images.forEach((image: any) => {
      deleteMutate({ _id: image._id });
    });
    setFieldValue("images", []);
  };
  const handleRemove = (file: any) => {
    const removeImage = values.images.filter((_file: any) => {
      if (_file._id === file._id) {
        deleteMutate({ _id: file._id });
      }
      return _file !== file;
    });
    setFieldValue("images", removeImage);
  };
  return (
    <RootStyle {...other}>
      <Typography variant="subtitle1" gutterBottom>
        {t("add-review")}
      </Typography>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ sm: "center" }}
              spacing={1.5}>
              <Typography variant="body2">{t("your-review-about")}</Typography>
              <Rating
                {...getFieldProps("rating")}
                onChange={(event: any) =>
                  setFieldValue("rating", Number(event.target.value))
                }
              />
            </Stack>
            {errors.rating && (
              <FormHelperText error>
                {touched.rating && t("rating-required")}
              </FormHelperText>
            )}

            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={5}
              label={t("review")}
              {...getFieldProps("review")}
              error={Boolean(touched.review && errors.review)}
              helperText={touched.review && t("review-error")}
            />
            <UploadMultiFile
              showPreview
              maxSize={3145728}
              accept="image/*"
              files={values.images}
              loading={loading}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onRemoveAll={handleRemoveAll}
              blob={values.blob}
              error={Boolean(touched.images && errors.images)}
            />
            {touched.images && errors.images && (
              <FormHelperText error sx={{ px: 2 }}>
                {touched.images && errors.images}
              </FormHelperText>
            )}
            <Stack direction="row" justifyContent="flex-end">
              <Button
                type="button"
                color="inherit"
                variant="outlined"
                onClick={onCancel}
                sx={{ mr: 1.5 }}>
                {t("cancel")}
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isLoading}>
                {t("post-review")}
              </LoadingButton>
            </Stack>
          </Stack>
        </Form>
      </FormikProvider>
    </RootStyle>
  );
}
