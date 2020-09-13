import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import { Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";
import { MyTextInput } from "../components/MyTextInput";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { useFormStyles } from "../utils/useFormStyles";

const Register: React.FC<{}> = ({}) => {
  const router = useRouter();
  const classes = useFormStyles();
  const [register] = useRegisterMutation();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box className={classes.paper}>
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
            <form className={classes.form} onSubmit={handleSubmit}>
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
                className={classes.submit}
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
};

export default Register;
