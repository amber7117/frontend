// next
import Image from "src/components/blurImage";
import useTranslation from "next-translate/useTranslation";
import Marquee from "react-fast-marquee";
// components
import { NoDataFound } from "src/components/illustrations";
// material
import { Typography, Box, Stack, Card, Skeleton } from "@mui/material";

// styles
import RootStyled from "./styled";

export default function Brands({ ...props }) {
  const { data } = props;
  const { t } = useTranslation("common");
  const setting = {
    gradient: false,
  };
  // console.log(data);
  return (
    <RootStyled>
      <Typography mt={8} variant="h2" color="text.primary" textAlign="center">
        {t("header.brands")}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        className="description"
      >
        {t("header.lorem-ipsum")}
      </Typography>
      {data?.length === 0 ? (
        <NoDataFound />
      ) : (
        <Marquee {...setting}>
          {data.map((v: any) => (
            <Stack key={v._id} spacing={3} direction="row" alignItems="center">
              <Box mx={3}>
                <Card className="slider-main">
                  <Image
                    src={v.logo.url}
                    alt="logo"
                    layout="fill"
                    objectFit="contain"
                    {...(v.logo.blurDataUrl && {
                      placeholder: "blur",
                      blurDataURL: v.logo.blurDataUrl,
                    })}
                  />
                </Card>
              </Box>
            </Stack>
          ))}
        </Marquee>
      )}
    </RootStyled>
  );
}
