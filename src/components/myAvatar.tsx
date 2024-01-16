//
import { MAvatar } from "./@material-extend";
import createAvatar from "src/utils/createAvatar";
import { Typography } from "@mui/material";

// ----------------------------------------------------------------------

export default function MyAvatar({ ...props }) {
  const { data, ...other } = props;
  return (
    <MAvatar
      src={data?.cover?.url}
      alt={data?.fullName + " cover"}
      color={"default"}
      {...other}
    >
      <Typography variant="h1">
        {data?.fullName?.slice(0, 1).toUpperCase()}
      </Typography>
    </MAvatar>
  );
}
