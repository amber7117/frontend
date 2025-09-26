// react
import { useState, useEffect } from "react";

// next
import Image from "next/image";
import { useRouter } from "next/navigation";
import useTranslation from "next-translate/useTranslation";

// material
import {
  Box,
  Paper,
  Button,
  Typography,
  CardContent,
  Container,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

// redux
import { useSelector } from "react-redux";

// framer motion
import { motion, AnimatePresence } from "framer-motion";
import { varFadeInRight, MotionContainer } from "../../animate";

// styles override
import RootStyled from "./styled";
import BlurImage from "src/components/blurImage";

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

// ----------------------------------------------------------------------
function CarouselItem({ ...props }) {
  const { item, index } = props;
  const { t } = useTranslation("common");

  const router = useRouter();
  const isMobile = useMediaQuery("@media (max-width: 992px)");
  const [first, setfirst] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setfirst(true);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <Paper className="slide-wrapper">
      <Box>
        {item && (
          <BlurImage
            priority
            fill
            objectFit="cover"
            sizes="100vw"
            src={item?.cover.url}
            alt="hero-carousel"
            placeholder="blur"
            blurDataURL={item?.cover.blurDataUrl}
          />
        )}
      </Box>
      <Box className="bg-overlay" />
      <Container>
        <CardContent className="card-content">
          <MotionContainer open={first}>
            <motion.div variants={varFadeInRight}>
              <Typography
                variant="h1"
                component="h1"
                lineHeight={1.1}
                gutterBottom>
                {item?.heading}
              </Typography>
            </motion.div>
            <motion.div variants={varFadeInRight}>
              <Typography variant="h6" gutterBottom>
                {item?.description}
              </Typography>
            </motion.div>
            <motion.div variants={varFadeInRight}>
              <div>
                <Button
                  size={isMobile ? "small" : "large"}
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => router.push(item?.btnPrimary.url)}>
                  {item?.btnPrimary.btnText || t("header.shop-now")}
                </Button>

                <Button
                  size={isMobile ? "small" : "large"}
                  variant="contained"
                  color="warning"
                  sx={{ mt: 1, mx: { sm: 2, xs: 1 } }}
                  onClick={() => router.push(item?.btnSecondary.url)}>
                  {item?.btnSecondary.btnText || t("header.see-all")}
                </Button>
              </div>
            </motion.div>
          </MotionContainer>
        </CardContent>
      </Container>
    </Paper>
  );
}

export default function CarouselAnimation({ ...props }) {
  const { data } = props;
  const { themeMode } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const router = useRouter();
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = Math.abs(page % data?.length);

  const paginate = (newDirection: any) => {
    setPage([page + newDirection, newDirection]);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      paginate(1); // Go to the next slide
    }, 10000); // 10 seconds in milliseconds

    return () => {
      clearTimeout(timer); // Clear the timer if the component unmounts
    };
  }, [page]); // Trigger the effect whenever the page changes

  const isEmpty = !Boolean(data?.length);

  return (
    <RootStyled>
      {isEmpty ? (
        <Stack
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}>
          <Typography variant="h4" color="text.secondary">
            Slides are not uploaded yet!
          </Typography>
        </Stack>
      ) : (
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            style={{ position: 'relative' }}>
            <CarouselItem
              themeMode={themeMode}
              item={data ? data[imageIndex] : null}
              index={data ? data[imageIndex] : null}
              activeStep={imageIndex}
              isActive={imageIndex}
              key={Math.random()}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </RootStyled>
  );
}
