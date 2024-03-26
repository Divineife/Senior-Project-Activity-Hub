import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import Tooltip from "@mui/material/Tooltip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const text = "Who shoud see your event on their feed";

const names = ["FISK", "MEHARRY", "TSU", "VANDERBILT"];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Visibility({ onVisibilityChange }) {
  const theme = useTheme();
  const [visibility, setVisibility] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setVisibility(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
    onVisibilityChange(event.target.value);
  };

  //   console.log("Selected", selectedVisibility)

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Visibility</InputLabel>
        <Tooltip
          placement="right"
          title={text}
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 1 }}
        >
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={visibility}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {names.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, visibility, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>
      </FormControl>
    </div>
  );
}