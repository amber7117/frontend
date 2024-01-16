import { last } from "lodash";
import PropTypes from "prop-types";
import NextLink from "next/link";
import { Typography, Box, Link, Breadcrumbs } from "@mui/material";

interface LinkItemProps {
  link: {
    href: string;
    name: string;
    icon?: React.ReactNode;
  };
}

function LinkItem({ link }: LinkItemProps) {
  const { href, name, icon } = link;
  return (
    <Link
      component={NextLink}
      key={name}
      href={href}
      passHref
      variant="body2"
      sx={{
        lineHeight: 2,
        display: "flex",
        alignItems: "center",
        color: "text.primary",
        "& > div": { display: "inherit" },
      }}
    >
      {icon && (
        <Box
          sx={{
            mr: 1,
            "& svg": { width: 20, height: 20 },
          }}
        >
          {icon}
        </Box>
      )}
      {name}
    </Link>
  );
}

interface MBreadcrumbsProps {
  links: Array<{
    href: string;
    name: string;
    icon?: React.ReactNode;
  }>;
  activeLast?: boolean;
}

export default function MBreadcrumbs({
  links,
  activeLast = false,
  ...other
}: MBreadcrumbsProps) {
  const currentLink = last(links)?.name;

  const listDefault = links.map((link) => (
    <LinkItem key={link.name} link={link} />
  ));
  const listActiveLast = links.map((link) => (
    <div key={link.name}>
      {link.name !== currentLink ? (
        <LinkItem link={link} />
      ) : (
        <Typography
          variant="body2"
          sx={{
            maxWidth: 260,
            overflow: "hidden",
            whiteSpace: "nowrap",
            color: "text.disabled",
            textOverflow: "ellipsis",
          }}
        >
          {currentLink}
        </Typography>
      )}
    </div>
  ));

  return (
    <Breadcrumbs separator="›" {...other}>
      {activeLast ? listDefault : listActiveLast}
    </Breadcrumbs>
  );
}
