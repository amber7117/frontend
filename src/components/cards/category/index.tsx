// next
import Image from "src/components/blurImage";
import { useRouter } from "next/navigation";

// material
import {
  Card,
  Typography,
  CardActionArea,
  Skeleton,
  Box,
  Badge,
} from "@mui/material";

// styles
import RootStyled from "./styled";
import { Stack } from "@mui/material";
// ----------------------------------------------------------------------

export default function CategoriesCard({ ...props }) {
  const { category, isLoading, onClickCard, state, totalItems, parent } = props;
  const baseUrl = "/products/";
  const router = useRouter();

  return (
    <Stack spacing={1}>
      <RootStyled>
        <CardActionArea
          className="card-action-area"
          onClick={() => {
            state !== null
              ? router.push(`${baseUrl + parent.slug + "/" + category.slug}`)
              : onClickCard();
          }}>
          <Box>
            {!isLoading && (
              <Badge
                className="badge"
                badgeContent={totalItems || category.totalItems || 0}
                color="primary"
              />
            )}
            {isLoading ? (
              <Skeleton variant="rounded" width="100%" height={129} />
            ) : (
              <Box className="image-wrapper">
                <Image
                  alt="category"
                  src={category?.cover?.url}
                  layout="fill"
                  {...(category?.cover?.blurDataUrl && {
                    placeholder: "blur",
                    blurDataURL: category?.cover?.blurDataUrl,
                  })}
                  objectFit="cover"
                  //
                  // blurDataURL={category?.cover?.blurDataUrl}
                />
              </Box>
            )}
          </Box>
        </CardActionArea>
      </RootStyled>
      <Typography
        variant="subtitle2"
        textAlign="center"
        noWrap
        className="title">
        {isLoading ? (
          <Skeleton variant="text" width={"100%"} />
        ) : state !== null ? (
          category.name
        ) : (
          category?.name
        )}
      </Typography>
    </Stack>
  );
}
