// react
import { useState } from "react";

// next
import BlurImage from "src/components/blurImage";
import Image from "next/image";

// material
import { Box, Stack } from "@mui/material";

// redux
import { useSelector } from "react-redux";

// framer motion
import { motion, AnimatePresence } from "framer-motion";

// styles override
import RootStyled from "./styled";

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
  const { item } = props;
  return (
    <div className="slide-wrapper">
      {item && (
        <BlurImage
          priority
          fill
          objectFit="cover"
          sizes="100vw"
          src={item?.url || item?.src}
          alt="hero-carousel"
        />
      )}
      <Box className="bg-overlay" />
    </div>
  );
}

export default function CarouselAnimation({ ...props }) {
  const { product, isDialog } = props;
  const images = product?.variants.flatMap((obj: any) => obj.images);

  const { themeMode } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = Math.abs(page % images?.length);
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <RootStyled
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : isDialog
            ? theme.palette.background.default
            : theme.palette.background.paper,
      }}>
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
            item={images[imageIndex]}
            index={images[imageIndex]}
            activeStep={imageIndex}
            isActive={imageIndex}
            key={Math.random()}
          />
        </motion.div>
      </AnimatePresence>
      <Stack
        direction="row"
        justifyContent={images.length < 6 ? "center" : "left"}
        spacing={1}
        className="controls-wrapper">
        {images.map((item: any, i: number) => (
          <Box
            key={Math.random()}
            className={`controls-button ${imageIndex === i ? "active" : ""}`}
            onClick={() => {
              setPage([i, i]);
            }}>
            <Image
              priority
              fill
              objectFit="cover"
              sizes="100vw"
              src={item.src || item.url}
              alt="hero-carousel"
            />
          </Box>
        ))}
      </Stack>
    </RootStyled>
  );
}
