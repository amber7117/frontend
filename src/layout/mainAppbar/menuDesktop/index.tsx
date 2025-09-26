import React from "react";
import { useState, useEffect } from "react";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
// next
import useTranslation from "next-translate/useTranslation";
import { useRouter, usePathname } from "next/navigation";
// material
import { Link, Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
// components
import MenuDesktopPopover from "src/components/popover/menudesktop";
import RootStyled from "./styled";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function MenuDesktopItem({ ...props }) {
  const {
    item,
    pathname,
    isHome,
    isOpen,
    isOffset,
    onOpen,
    isLoading,
    onClose,
    data,
    scrollPosition,
    router,
  } = props;
  const { title, path, isDropdown } = item;
  const anchorRef: any = React.useRef(null);
  const isActive: boolean = pathname === path;
  const { t } = useTranslation("common");
  if (isDropdown) {
    return (
      <>
        <Link
          ref={anchorRef}
          className={`link ${isOffset && isHome && "offset"}`}
          id="composition-button"
          aria-controls={isOpen ? "composition-menu" : undefined}
          aria-expanded={isOpen ? "true" : undefined}
          aria-haspopup="true"
          onClick={onOpen}>
          {t(title)}

          {isOpen ? (
            <KeyboardArrowUpRoundedIcon className="link-icon" />
          ) : (
            <KeyboardArrowDownRoundedIcon className="link-icon" />
          )}
        </Link>
        <MenuDesktopPopover
          isOpen={isOpen}
          scrollPosition={scrollPosition}
          onClose={onClose}
          isLoading={isLoading}
          data={data}
        />
      </>
    );
  }

  return (
    <Link
      key={title}
      onClick={() => {
        router.push(path);
      }}
      className={`link ${isActive && "active"}`}>
      {t(title)}
    </Link>
  );
}

function MenuDesktopContent({ ...props }) {
  const { isOffset, isHome, navConfig, isLeft } = props;
  const router = useRouter();
  const pathname = usePathname();
  const { categories } = useSelector(
    ({ categories }: { categories: any }) => categories
  );
  const isLoading = !categories;

  const [open, setOpen] = useState(false);

  const [scrollPosition, setPosition] = useState(0);
  useEffect(() => {
    function updatePosition() {
      setPosition(window.pageYOffset);
    }
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", updatePosition);
      updatePosition();
      return () => window.removeEventListener("scroll", updatePosition);
    }
  }, []);

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <RootStyled direction="row" className={isLeft && "main"}>
      {navConfig.map((links: any) => (
        <MenuDesktopItem
          scrollPosition={scrollPosition}
          key={Math.random()}
          data={categories}
          item={links}
          isLoading={isLoading}
          pathname={pathname}
          isOpen={open}
          onOpen={handleOpen}
          onClose={handleClose}
          isOffset={isOffset}
          isHome={isHome}
          router={router}
        />
      ))}
    </RootStyled>
  );
}

export default function MenuDesktop({ ...props }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  if (!isClient) {
    return (
      <RootStyled direction="row" className={props.isLeft && "main"}>
        {props.navConfig.map((links: any) => (
          <Skeleton 
            key={links.title}
            variant="rectangular" 
            width={links.title === "categories" ? 96 : 54} 
            height={22} 
            sx={{ borderRadius: "4px", mx: "6px" }} 
          />
        ))}
      </RootStyled>
    );
  }

  return <MenuDesktopContent {...props} />;
}
