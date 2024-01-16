// material
import { styled } from "@mui/material/styles";
// material
import { Box, Typography, Container, Card } from "@mui/material";
//
import MyAvatar from "src/components/myAvatar";
import { useSelector } from "react-redux";
import { createGradient } from "src/theme/palette";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  height: 280,
  position: "relative",
  borderRadius: 0,
  borderWidth: 0,
  borderBottomWidth: 1,
  "& > div:before": {
    top: 0,
    zIndex: 9,
    width: "100%",
    content: "''",
    height: "100%",
    position: "absolute",
    background: createGradient(
      theme.palette.primary.main,
      theme.palette.primary.dark
    ),
  },
}));

const InfoStyle = styled("div")(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: "absolute",
  marginTop: theme.spacing(8),
  [theme.breakpoints.up("md")]: {
    right: "auto",
    display: "flex",
    alignItems: "center",
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

const CoverImgStyle = styled("div")({
  zIndex: 8,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
});

// ----------------------------------------------------------------------

export default function ProfileCover() {
  const { user } = useSelector(({ user }: { user: any }) => user);

  return (
    <RootStyle>
      <div>
        <Container fixed>
          <InfoStyle>
            <MyAvatar
              data={{ cover: user?.cover, fullName: user?.fullName }}
              sx={{
                mx: "auto",
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "common.white",
                width: { xs: 80, md: 128 },
                height: { xs: 80, md: 128 },
              }}
            />
            <Box
              sx={{
                ml: { md: 3 },
                mt: { xs: 1, md: 0 },
                color: "common.white",
                textAlign: { xs: "center", md: "left" },
              }}>
              <Typography variant="h4">{user?.fullName}</Typography>
              <Typography sx={{ opacity: 0.72 }}>{user?.email}</Typography>
            </Box>
          </InfoStyle>
          <CoverImgStyle />
        </Container>
      </div>
    </RootStyle>
  );
}
