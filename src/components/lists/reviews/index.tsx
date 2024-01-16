import Image from "src/components/blurImage";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
// material
import {
  Box,
  List,
  Skeleton,
  Avatar,
  ListItem,
  // Pagination,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
// utils
import { fDate } from "src/utils/formatTime";
import Rating from "@mui/material/Rating";
import useTranslation from "next-translate/useTranslation";
const NoDataIllustration = dynamic(
  () => import("src/components/illustrations/noDataFound/noDataFound")
);

// ----------------------------------------------------------------------

ReviewItem.propTypes = {
  review: PropTypes.object,
};

function ReviewItem({ ...props }) {
  const { review, isLoading } = props;

  const { t } = useTranslation("details");
  return (
    <Box pt={2}>
      <ListItem
        disableGutters
        sx={{
          alignItems: "flex-start",
          px: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box
          sx={{
            mr: 1,
            display: "flex",
            alignItems: "center",
            mb: { xs: 2, sm: 0 },
            textAlign: { sm: "center" },
            flexDirection: { sm: "column" },
          }}
        >
          <Avatar
            src={review.user?.cover?.url}
            alt={review.user?.fullName}
            sx={{
              mr: { xs: 2, sm: 0 },
              mb: { sm: 2 },
              width: 64,
              height: 64,
            }}
          />
        </Box>

        <Box width={1}>
          <Box sx={{ float: "right" }}>
            {review?.isPurchased && (
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "primary.main",
                }}
              >
                <VerifiedRoundedIcon sx={{ fontSize: 16 }} />
                &nbsp;{t("verified-purchase")}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", float: "right" }}
              noWrap
            >
              {fDate(review.createdAt)}
            </Typography>
          </Box>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{ textTransform: "capitalize" }}
          >
            {review.user?.fullName}
          </Typography>

          <Typography variant="subtitle2" mb={1} mt={0.5} fontWeight={400}>
            {review.review}
          </Typography>
          {
            <Rating
              size="small"
              value={review.rating}
              precision={0.1}
              readOnly
            />
          }
        </Box>
      </ListItem>
      <Box p={3}>
        <Grid container spacing={2} sx={{ img: { borderRadius: "8px" } }}>
          {!isLoading &&
            review.images.map((image: any) => (
              <Grid item xs={6} md={3} lg={2} key={Math.random()}>
                <Box
                  sx={{
                    position: "relative",
                    height: 100,
                  }}
                >
                  {" "}
                  <Image
                    src={image}
                    alt={review.name + "'s review"}
                    layout="fill"
                    objectFit="cover"
                  />
                </Box>
              </Grid>
            ))}
        </Grid>
      </Box>
      <Divider />
    </Box>
  );
}

ProductDetailsReviewList.propTypes = {
  product: PropTypes.object,
};

export default function ProductDetailsReviewList({ ...props }) {
  const { reviews, isLoading } = props;
  console.log(reviews, "review");
  return (
    <Box>
      {!isLoading && reviews?.length < 1 && (
        <Grid item md={12}>
          <NoDataIllustration
            sx={{
              maxWidth: 300,
              svg: {
                width: 300,
                height: 300,
              },
            }}
          />
        </Grid>
      )}
      <List disablePadding>
        {reviews?.map((review: any) => (
          <ReviewItem
            key={Math.random()}
            review={review}
            isLoading={isLoading}
          />
        ))}
      </List>
    </Box>
  );
}
