import PropTypes from "prop-types";
import { useState } from "react";
import dynamic from "next/dynamic";
// material
import { Divider, Collapse, Grid } from "@mui/material";
//
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
// redux
import { useSelector } from "react-redux";
const ReviewForm = dynamic(
  () => import("src/components/_main/productDetails/form")
);
const ReviewOverview = dynamic(
  () => import("src/components/_main/productDetails/overview")
);
const ReviewsList = dynamic(() => import("src/components/lists/reviews"));

// ----------------------------------------------------------------------

ProductDetailsReview.propTypes = {
  product: PropTypes.object,
};
export default function ProductDetailsReview({ ...props }) {
  const { pid, reviews, totalRating, totalReviews, reviewsSummery } = props;
  const router = useRouter();
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const [state, setstate] = useState<any>([]);
  const [reviewBox, setReviewBox] = useState(false);
  const { isAuthenticated } = useSelector(({ user }: { user: any }) => user);
  const handleOpenReviewBox = () => {
    isAuthenticated
      ? setReviewBox((prev) => !prev)
      : router.push("/auth/login?redirect=" + pathname);
  };
  const handleCloseReviewBox = () => {
    setReviewBox(false);
    setTimeout(() => {
      setCount(count + 1);
    }, 500);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={4}>
          <ReviewOverview
            totalRating={totalRating}
            totalReviews={totalReviews}
            reviews={[...state, ...reviews]}
            onOpen={handleOpenReviewBox}
            reviewsSummery={reviewsSummery}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Collapse in={reviewBox}>
            <ReviewForm
              onAddingReview={(v: any) => setstate([v, ...state])}
              pid={pid}
              onClose={handleCloseReviewBox}
              id="move_add_review"
              onClickCancel={() => setReviewBox(false)}
            />
            <Divider />
          </Collapse>
          <ReviewsList reviews={[...state, ...reviews]} />
        </Grid>
      </Grid>
    </>
  );
}
