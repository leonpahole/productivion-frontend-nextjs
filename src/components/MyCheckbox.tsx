import { Checkbox, FormControlLabel } from "@material-ui/core";
import { useField } from "formik";

export const MyCheckbox = ({ label, ...props }: any) => {
  const [field] = useField(props);

  return (
    <FormControlLabel
      control={<Checkbox checked={field.value} {...field} {...props} />}
      label={label}
    />
  );
};
