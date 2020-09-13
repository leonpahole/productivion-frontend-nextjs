import {
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  Typography,
  Box,
} from "@material-ui/core";
import { Formik } from "formik";
import { useSnackbar } from "material-ui-snackbar-provider";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";
import { MyTextInput } from "../components/MyTextInput";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { AppError } from "../types/AppError";
import { useFormStyles } from "../utils/useFormStyles";
import { ValueType } from "../utils/valueType";
import { NETWORK_ERROR } from "../utils/texts";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const classes = useFormStyles();
  const [login] = useLoginMutation();
  const snackbar = useSnackbar();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box className={classes.paper}>
        <Typography component="h1" variant="h2">
          ProductiviON
        </Typography>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>

        <Formik
          initialValues={{
            email: "",
            password: "",
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
              router.push("/");
            } else if (result.errors && result.errors.length > 0) {
              const error = (result.errors[0] as unknown) as AppError;
              if (error.type === "auth-error") {
                setErrors({
                  email: "Invalid email or password combination",
                  password: "Invalid email or password combination",
                });
              }
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form className={classes.form} onSubmit={handleSubmit}>
              <MyTextInput label="Email Address" name="email" type="email" />

              <MyTextInput label="Password" name="password" type="password" />

              <Button
                type="submit"
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Log in
              </Button>

              <Grid container justify="center">
                <Grid item>
                  <NextLink href="/login">
                    <Link href="#" variant="body2">
                      {"Don't have an account? Create one"}
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
};

export default Login;
