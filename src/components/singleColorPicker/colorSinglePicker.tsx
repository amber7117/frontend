// material
import { Box, Radio, Tooltip } from "@mui/material";
import FileDownloadDoneRoundedIcon from "@mui/icons-material/FileDownloadDoneRounded";

// styles
import RootStyled from "./styled";
// ----------------------------------------------------------------------

function IconColor({ ...props }) {
  const { sx, ...other } = props;
  return (
    <Box {...other}>
      <FileDownloadDoneRoundedIcon />
    </Box>
  );
}

export default function ColorSinglePicker({ ...props }) {
  const { colors, ...other } = props;
  return (
    <RootStyled row {...other}>
      {colors?.map((color: string) => {
        const isWhite = color === "#FFFFFF" || color === "white";

        return (
          <Tooltip title={color} placement="top" key={Math.random()}>
            <Radio
              key={color}
              value={color}
              color="default"
              icon={
                <IconColor className={`icon-color ${isWhite && "is-white"}`} />
              }
              checkedIcon={
                <IconColor
                  className={`icon-color checked-icon ${isWhite && "is-white"}`}
                />
              }
              sx={{
                color,
                "&:hover": { opacity: 0.72 },
              }}
            />
          </Tooltip>
        );
      })}
    </RootStyled>
  );
}
