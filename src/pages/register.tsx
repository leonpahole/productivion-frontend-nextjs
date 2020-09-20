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
import React from "react";
import * as Yup from "yup";
import { MyTextInput } from "../components/MyTextInput";
import { useRegisterMutation } from "../generated/graphql";
import { NETWORK_ERROR } from "../utils/texts";
import { useAuthStyles } from "../utils/useAuthStyles";
import { useFormStyles } from "../utils/useFormStyles";
import { ValueType } from "../utils/valueType";

const Register: React.FC<{}> = ({}) => {
  const formStyles = useFormStyles();
  const authStyles = useAuthStyles();

  const [register] = useRegisterMutation();

  const snackbar = useSnackbar();

  return (
    <Grid container component="main" className={authStyles.root}>
      <Grid className={authStyles.imageContainer} item xs={false} sm={4} md={7}>
        <Box display="flex" flexDirection="column" p={3}>
          <Box mt={10} mb={5}>
            <Typography variant="h2" className={authStyles.heading}>
              Start organizing your projects.
            </Typography>
          </Box>
          <Box height="30%" display="flex" justifyContent="center">
            <img className={authStyles.image} src="/todo-register.png" />
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
            Create your free ProductiviON account
          </Typography>
          <Formik
            validateOnBlur={false}
            initialValues={{
              email: "",
              name: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email address!")
                .max(250, "Email shouldn't be longer than 250 letters!")
                .required("Please enter your email address!"),
              name: Yup.string()
                .min(4, "Name should be at least 4 letters long!")
                .max(40, "Name shouldn't be longer than 40 letters!")
                .required("Please enter your name!"),
              password: Yup.string()
                .min(4, "Password should be at least 4 letters long!")
                .max(250, "Password shouldn't be longer than 250 letters!")
                .required("Please enter your password!"),
              confirmPassword: Yup.string()
                .oneOf(
                  [Yup.ref("password"), undefined],
                  "Passwords don't match!"
                )
                .required("Please confirm your password!"),
            })}
            onSubmit={async (values, { resetForm }) => {
              let result: null | ValueType<ReturnType<typeof register>> = null;

              try {
                result = await register({
                  variables: {
                    input: {
                      email: values.email,
                      name: values.name,
                      password: values.password,
                    },
                  },
                });
              } catch (e) {
                snackbar.showMessage(NETWORK_ERROR);
                return;
              }

              if (result.data?.register) {
                snackbar.showMessage(
                  "Account created! Check your inbox for a verification email."
                );
                resetForm();
              } else if (result.errors && result.errors.length > 0) {
                snackbar.showMessage(NETWORK_ERROR);
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
                <MyTextInput label="Your name" name="name" />
                <MyTextInput label="Password" name="password" type="password" />
                <MyTextInput
                  label="Confirm password"
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
                  Create an account
                </Button>

                <Grid container>
                  <Grid item>
                    <NextLink href="/login">
                      <Link href="#" variant="body2" color="textPrimary">
                        Already have an account? Sign in
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

  /*
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box className={formStyles.paper}>
        <Typography component="h1" variant="h2">
          ProductiviON
        </Typography>
        <Typography component="h1" variant="h5">
          Create an account
        </Typography>

        <Formik
          initialValues={{
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address!")
              .max(250, "Email shouldn't be longer than 250 letters!")
              .required("Please enter your email address!"),
            name: Yup.string()
              .min(4, "Name should be at least 4 letters long!")
              .max(40, "Name shouldn't be longer than 40 letters!")
              .required("Please enter your name!"),
            password: Yup.string()
              .min(4, "Password should be at least 4 letters long!")
              .max(250, "Password shouldn't be longer than 250 letters!")
              .required("Please enter your password!"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password"), undefined], "Passwords don't match!")
              .required("Please confirm your password!"),
          })}
          onSubmit={async (values) => {
            const result = await register({
              variables: {
                input: {
                  email: values.email,
                  name: values.name,
                  password: values.password,
                },
              },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.register!,
                  },
                });
              },
            });

            if (result.data?.register) {
              router.push("/");
            } else if (result.errors && result.errors.length > 0) {
              //   const error = (result.errors[0] as unknown) as AppError;
              //   if (error.type === "validation-error") {
              //     setErrors(error.inputErrors)
              //   }
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form className={formStyles.form} onSubmit={handleSubmit}>
              <MyTextInput label="Email Address" name="email" type="email" />

              <MyTextInput label="Your name" name="name" />

              <MyTextInput label="Password" name="password" type="password" />

              <MyTextInput
                label="Confirm password"
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
                Create an account
              </Button>

              <Grid container justify="center">
                <Grid item>
                  <NextLink href="/login">
                    <Link href="#" variant="body2">
                      {"Already have an account? Sign In"}
                    </Link>
                  </NextLink>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </Container>
  );
  */
};

export default Register;
