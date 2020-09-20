import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  Paper,
  Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Formik } from "formik";
import { useSnackbar } from "material-ui-snackbar-provider";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";
import { MyTextInput } from "../components/MyTextInput";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { AppError } from "../types/AppError";
import { NETWORK_ERROR } from "../utils/texts";
import { useFormStyles } from "../utils/useFormStyles";
import { useAuthStyles } from "../utils/useAuthStyles";
import { ValueType } from "../utils/valueType";
import { MyCheckbox } from "../components/MyCheckbox";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const formStyles = useFormStyles();
  const authStyles = useAuthStyles();

  const [login, { loading }] = useLoginMutation();
  const snackbar = useSnackbar();

  return (
    <Grid container component="main" className={authStyles.root}>
      <Grid className={authStyles.imageContainer} item xs={false} sm={4} md={7}>
        <Box display="flex" flexDirection="column" p={3}>
          <Box mt={10} mb={5}>
            <Typography variant="h2" className={authStyles.heading}>
              Deliver more than expected.
            </Typography>
          </Box>
          <Box height="30%" display="flex" justifyContent="center">
            <img className={authStyles.image} src="/todo-signin.png" />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={formStyles.paper}>
          <NextLink href="/">
            <Link
              className={authStyles.formHeading}
              href="#"
              variant="h2"
              color="textPrimary"
            >
              ProductiviON
            </Link>
          </NextLink>
          <Avatar className={authStyles.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" align="center">
            Sign in to your ProductiviON account
          </Typography>
          <Formik
            validateOnBlur={false}
            initialValues={{
              email: "",
              password: "",
              rememberMe: false,
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email address!")
                .max(250, "Email shouldn't be longer than 250 letters!")
                .required("Please enter your email address!"),
              password: Yup.string()
                .min(4, "Password should be at least 4 letters long!")
                .max(250, "Password shouldn't be longer than 250 letters!")
                .required("Please enter your password!"),
            })}
            onSubmit={async (values, { setErrors }) => {
              let result: null | ValueType<ReturnType<typeof login>> = null;

              try {
                result = await login({
                  variables: {
                    input: {
                      email: values.email,
                      password: values.password,
                      rememberMe: values.rememberMe,
                    },
                  },
                  update: (cache, { data }) => {
                    cache.writeQuery<MeQuery>({
                      query: MeDocument,
                      data: {
                        __typename: "Query",
                        me: data?.login!,
                      },
                    });
                  },
                });
              } catch (e) {
                snackbar.showMessage(NETWORK_ERROR);
                return;
              }

              if (result.data?.login) {
                snackbar.showMessage(`Welcome, ${result.data.login.name}!`);
                router.push("/my-projects");
              } else if (result.errors && result.errors.length > 0) {
                const error = (result.errors[0] as unknown) as AppError;
                console.log(error);
                if (error.type === "auth-error") {
                  setErrors({
                    email: "Invalid email or password combination",
                    password: "Invalid email or password combination",
                  });
                } else if (error.type === "unverified-error") {
                  setErrors({
                    email: " ",
                    password: "Please validate your account before signing in",
                  });
                }
              }
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <form className={formStyles.form} onSubmit={handleSubmit}>
                <MyTextInput
                  label="Email Address"
                  name="email"
                  type="email"
                  autoFocus
                />

                <MyTextInput label="Password" name="password" type="password" />

                <MyCheckbox label="Remember me" name="rememberMe" />

                <Button
                  type="submit"
                  disabled={isSubmitting || loading}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={formStyles.submit}
                >
                  Sign in
                </Button>

                <Grid container>
                  <Grid item xs>
                    <NextLink href="/register">
                      <Link href="#" variant="body2" color="textPrimary">
                        Create a free account
                      </Link>
                    </NextLink>
                  </Grid>
                  <Grid item>
                    <NextLink href="/forgot-password">
                      <Link href="#" variant="body2" color="textPrimary">
                        Forgot password?
                      </Link>
                    </NextLink>
                  </Grid>
                </Grid>

                <Box mt={5}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                  >
                    <NextLink href="/">
                      <Link color="inherit" href="#">
                        To home page
                      </Link>
                    </NextLink>
                  </Typography>
                </Box>
              </form>
            )}
          </Formik>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
