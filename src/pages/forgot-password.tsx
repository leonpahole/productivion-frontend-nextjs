import { Box, Button, Container, Typography } from "@material-ui/core";
import { Formik } from "formik";
import { useSnackbar } from "material-ui-snackbar-provider";
import React from "react";
import * as Yup from "yup";
import { MyTextInput } from "../components/MyTextInput";
import { useForgotPasswordMutation } from "../generated/graphql";
import { NETWORK_ERROR } from "../utils/texts";
import { useFormStyles } from "../utils/useFormStyles";
import { ValueType } from "../utils/valueType";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const [forgotPassword] = useForgotPasswordMutation();
  const formStyles = useFormStyles();
  const snackbar = useSnackbar();

  return (
    <Container component="main" maxWidth="sm">
      <div className={formStyles.paper}>
        <Box mb={2}>
          <Typography component="h1" variant="h2" align="center">
            Forgot password
          </Typography>
        </Box>
        <Typography component="h2" variant="subtitle1" align="center">
          Forgot your password? Enter your email address and we will send you an
          email with instructions for resetitng your password.
        </Typography>

        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address!")
              .max(250, "Email shouldn't be longer than 250 letters!")
              .required("Please enter your email address!"),
          })}
          onSubmit={async (values, { resetForm }) => {
            let result: null | ValueType<
              ReturnType<typeof forgotPassword>
            > = null;

            try {
              result = await forgotPassword({
                variables: {
                  email: values.email,
                },
              });
            } catch (e) {
              console.log(e);
              snackbar.showMessage(NETWORK_ERROR);
              return;
            }

            if (!result || !result.data || !result.data.forgotPassword) {
              snackbar.showMessage(NETWORK_ERROR);
              return;
            }

            snackbar.showMessage(
              `Email with instructions has been sent, please check your inbox.`
            );
            resetForm();
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form className={formStyles.form} onSubmit={handleSubmit}>
              <MyTextInput label="Email Address" name="email" type="email" />

              <Button
                type="submit"
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                color="primary"
                className={formStyles.submit}
              >
                Send reset email
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default ForgotPassword;
