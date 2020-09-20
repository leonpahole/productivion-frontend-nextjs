import { Formik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useResetPasswordMutation } from "../../generated/graphql";
import * as Yup from "yup";
import { Container, Box, Typography, Button } from "@material-ui/core";
import { ValueType } from "../../utils/valueType";
import { NETWORK_ERROR } from "../../utils/texts";
import { MyTextInput } from "../../components/MyTextInput";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useFormStyles } from "../../utils/useFormStyles";

const ResetPassword: NextPage<{ token: string }> = ({ token }) => {
  const [resetPassword] = useResetPasswordMutation();
  const router = useRouter();
  const snackbar = useSnackbar();
  const formStyles = useFormStyles();

  return (
    <Container component="main" maxWidth="sm">
      <div className={formStyles.paper}>
        <Box mb={2}>
          <Typography component="h1" variant="h2" align="center">
            Reset your password
          </Typography>
        </Box>
        <Typography component="h2" variant="subtitle1" align="center">
          You have requested to reset your password. Please enter it below and
          click on the button to confirm.
        </Typography>

        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            password: Yup.string()
              .min(4, "Password should be at least 4 letters long!")
              .max(250, "Password shouldn't be longer than 250 letters!")
              .required("Please enter your password!"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password"), undefined], "Passwords don't match!")
              .required("Please confirm your password!"),
          })}
          onSubmit={async (values, { resetForm }) => {
            let result: null | ValueType<
              ReturnType<typeof resetPassword>
            > = null;

            try {
              result = await resetPassword({
                variables: {
                  input: {
                    password: values.password,
                    token,
                  },
                },
              });
            } catch (e) {
              console.log(e);
              snackbar.showMessage(NETWORK_ERROR);
              return;
            }

            if (!result || !result.data || !result.data.resetPassword) {
              snackbar.showMessage(NETWORK_ERROR);
              return;
            }

            snackbar.showMessage(`Your password has been reset.`);
            resetForm();
            router.push("/login");
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form className={formStyles.form} onSubmit={handleSubmit}>
              <MyTextInput
                label="New password"
                name="password"
                type="password"
              />

              <MyTextInput
                label="Confirm new password"
                name="confirmPassword"
                type="password"
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                color="primary"
                className={formStyles.submit}
              >
                Reset password
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

ResetPassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ResetPassword;
