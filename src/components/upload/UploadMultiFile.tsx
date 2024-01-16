import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// material
import { alpha, styled } from "@mui/material/styles";
import {
  Box,
  List,
  Stack,
  Paper,
  Button,
  ListItem,
  Typography,
  Skeleton,
  IconButton,
} from "@mui/material";
// utils
import { fData } from "src/utils/formatNumber";
//

import { varFadeInRight } from "../animate";
import useTranslation from "next-translate/useTranslation";

// ----------------------------------------------------------------------

const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  border: `1px dashed ${theme.palette.divider}`,
  "&:hover": { opacity: 0.72, cursor: "pointer" },
  [theme.breakpoints.up("md")]: { textAlign: "left", flexDirection: "row" },
}));

// ----------------------------------------------------------------------

UploadMultiFile.propTypes = {
  error: PropTypes.bool,
  showPreview: PropTypes.bool,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  sx: PropTypes.object,
};

export default function UploadMultiFile({ ...props }) {
  const {
    error,
    showPreview = false,
    files,
    onRemove,
    blob,
    isInitialized,
    isEdit,
    onRemoveAll,
    loading,
    sx,
    ...other
  } = props;
  const hasFile = files.length > 0;
  const { t } = useTranslation("common");
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      ...other,
    });

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
        }}
      >
        <input {...getInputProps()} disabled={loading} />
        {/* <UploadIllustration sx={{ width: 220 }} /> */}
        <Box sx={{ p: 3, ml: { md: 2 } }}>
          <Typography gutterBottom variant="h5">
            {t("drop-or-a-select-images")}
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("drop-images-description")}
          </Typography>
        </Box>
      </DropZoneStyle>

      <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
        {(loading
          ? [...Array(isEdit ? files.length + blob.length : blob.length)]
          : files
        ).map((file: any) =>
          loading ? (
            <ListItem
              key={Math.random()}
              {...varFadeInRight}
              sx={{
                my: 1,
                p: 0,
                width: 80,
                height: 80,
                borderRadius: 1,
                display: "inline-flex",
                mx: 0.5,
                border: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
            </ListItem>
          ) : (
            <ListItem
              key={Math.random()}
              {...varFadeInRight}
              sx={{
                p: 0,
                m: 0.5,
                width: 80,
                height: 80,
                borderRadius: 1.5,
                overflow: "hidden",
                position: "relative",
                display: "inline-flex",
              }}
            >
              <Paper
                variant="outlined"
                component="img"
                src={!file.blob ? file.url : file.blob}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                }}
              />

              <Box sx={{ top: 6, right: 6, position: "absolute" }}>
                <IconButton
                  size="small"
                  onClick={() => onRemove(file)}
                  sx={{
                    p: "2px",
                    color: "common.white",
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                    },
                  }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </Box>
            </ListItem>
          )
        )}
      </List>

      {hasFile && (
        <Stack direction="row" justifyContent="flex-end">
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={106}
              height={36}
              sx={{ mr: 1.5 }}
            />
          ) : (
            <Button variant="contained" onClick={onRemoveAll} sx={{ mr: 1.5 }}>
              {t("remove-all")}
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}
