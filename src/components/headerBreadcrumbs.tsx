import { isString } from "lodash";

// material
import { Box, Typography, Link } from "@mui/material";

// components
import { MBreadcrumbs } from "./@material-extend";
// ----------------------------------------------------------------------

export default function HeaderBreadcrumbs({ ...props }) {
  const { links, action, heading, moreLink = "", sx, ...other } = props;
  return (
    <Box sx={{  ...sx }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ textTransform: "capitalize", width: "80vw" }}
            noWrap
          >
            {heading}
          </Typography>
          <MBreadcrumbs links={links} {...other} />
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>

      <Box >
        {isString(moreLink) ? (
          <Link href={moreLink} target="_blank" variant="body2">
            {moreLink}
          </Link>
        ) : (
          moreLink.map((href: string) => (
            <Link
              noWrap
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              sx={{ display: "table" }}
            >
              {href}
            </Link>
          ))
        )}
      </Box>
    </Box>
  );
}
