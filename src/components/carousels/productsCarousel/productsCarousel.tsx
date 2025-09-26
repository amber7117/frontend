// react
import { useState, useEffect, forwardRef } from "react";

// next
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// material
import {
  Paper,
  useMediaQuery,
  Grid,
  Fab,
  Dialog,
  DialogContent,
  Fade,
  Stack,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { TransitionProps } from "@mui/material/transitions";

// redux
import { useSelector } from "react-redux";

// framer motion
import { motion, AnimatePresence } from "framer-motion";

// styles override
import RootStyled from "./styled";
import { ProductCard } from "src/components/cards";

const ProductDetailsSumary = dynamic(
  () => import("src/components/_main/productDetails/summary"),
  {
    ssr: false,
  }
);
const DialogCarousel = dynamic(
  () => import("src/components/carousels/detailsCarousel/detailsCarousel"),
  {
    ssr: false,
  }
);

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

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
  const { index, unitRate, symbol } = props;
  const [product, setProduct] = useState<string | null>(null);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    setloading(false);
  }, []);

  return (
    <Paper className="slide-wrapper">
      <ProductCard
        product={index}
        loading={false}
        isLoaded={!loading}
        loadingRedux={false}
        symbol={symbol}
        unitRate={unitRate}
        onClickCart={() => (loading ? setProduct(null) : setProduct(index))}
      />
      <Dialog
        open={Boolean(product)}
        onClose={() => setProduct(null)}
        maxWidth="md"
        TransitionComponent={Transition}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              {product && <DialogCarousel product={product} isDialog />}
            </Grid>
            <Grid item xs={12} md={7}>
              {product && (
                <ProductDetailsSumary
                  product={product}
                  isLoading={loading}
                  isDialog
                  unitRate={unitRate}
                  symbol={symbol}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

function isFloat(number: number) {
  return Number(number) === number && number % 1 !== 0;
}

export default function ProductsCarousel({ ...props }) {
  const { data } = props;
  const router = useRouter();
  const isLarge: any = useMediaQuery("(min-width:1200px)");
  const isDesktop: any = useMediaQuery("(min-width:900px)");
  const isTablet: any = useMediaQuery("(min-width:600px)");
  const isMobile: any = useMediaQuery("(max-width:600px)");

  const { themeMode, symbol, unitRate } = useSelector(
    ({ settings }: { settings: any }) => settings
  );

  const [[page, direction], setPage] = useState([0, 0]);
  var slidesToShow = isLarge
    ? 4
    : isDesktop
    ? 3
    : isTablet
    ? 2
    : isMobile
    ? 1
    : 4;
  var total: any = data.length / slidesToShow;
  var totalSlides =
    total === 0 ? 0 : isFloat(total) ? Math.floor(total) + 1 : total;

  const imageIndex = page;

  const paginate = (newDirection: number) => {
    const nextPage = page + newDirection;
    if (nextPage >= 0 && nextPage <= totalSlides - 1) {
      setPage([nextPage, newDirection]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const nextPage = page + 1;
      if (nextPage >= 0 && nextPage <= totalSlides - 1) {
        setPage([nextPage, 1]);
      }
    }, 12000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 在Next.js 14中，locale不再通过useRouter获取
  // 这里使用默认的row方向，或者可以通过其他方式获取locale
  const directionStyle = "row"; // 默认方向

  return (
    <RootStyled>
      <Paper className="main-paper">
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
            <Grid container spacing={2} justifyContent="center">
              {data
                ?.slice(
                  imageIndex * slidesToShow,
                  (imageIndex + 1) * slidesToShow
                )
                .map((item: any) => (
                  <Grid item lg={3} md={4} sm={6} xs={12} key={Math.random()}>
                    <CarouselItem
                      themeMode={themeMode}
                      item={data ? item : null}
                      index={data ? item : null}
                      activeStep={imageIndex}
                      isActive={imageIndex}
                      key={Math.random()}
                      symbol={symbol}
                      unitRate={unitRate}
                    />
                  </Grid>
                ))}
            </Grid>
          </motion.div>
        </AnimatePresence>
      </Paper>
      <Stack
        direction={directionStyle}
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        className="slider-arrows">
        <Fab
          color="primary"
          aria-label="back"
          size="small"
          className="left"
          onClick={() => paginate(-1)}
          disabled={page === 0}>
          <ArrowBackRoundedIcon />
        </Fab>
        <Fab
          color="primary"
          aria-label="forward"
          size="small"
          className="right"
          onClick={() => paginate(1)}
          disabled={totalSlides - 1 === page}>
          <ArrowForwardRoundedIcon />
        </Fab>
      </Stack>
    </RootStyled>
  );
}
