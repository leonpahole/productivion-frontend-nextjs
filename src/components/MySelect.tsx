import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from "@material-ui/core";
import { useField } from "formik";

export const MySelect = ({
  label,
  showNone,
  options,
  onChange,
  ...props
}: any) => {
  const [field] = useField(props);

  return (
    <Box>
      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel id="select-role-label">{label}</InputLabel>
        <Select
          labelId="select-role-label"
          label={label}
          {...field}
          {...props}
          onChange={onChange}
        >
          {showNone && (
            <MenuItem value={0}>
              <em>None</em>
            </MenuItem>
          )}

          {options.map((option: any) => (
            <MenuItem value={option.value}>{option.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
