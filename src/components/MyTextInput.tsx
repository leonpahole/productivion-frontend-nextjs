import { useField } from "formik";
import { TextField } from "@material-ui/core";

export const MyTextInput = ({ label, ...props }: any) => {
  const [field, meta] = useField(props);

  return (
    <TextField
      label={label}
      variant="outlined"
      margin="normal"
      fullWidth
      autoComplete={props.name || props.id}
      {...field}
      {...props}
      error={meta.touched && meta.error}
      helperText={meta.touched && meta.error ? meta.error : null}
    />
  );
};
