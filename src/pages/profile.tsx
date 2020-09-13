import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Typography,
} from "@material-ui/core";
import { Formik } from "formik";
import { useSnackbar } from "material-ui-snackbar-provider";
import React from "react";
import * as Yup from "yup";
import { MyTextInput } from "../components/MyTextInput";
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
  useMeQuery,
  useUpdateUserMutation,
} from "../generated/graphql";
import { NETWORK_ERROR } from "../utils/texts";
import { useFormStyles } from "../utils/useFormStyles";

const Profile: React.FC<{}> = ({}) => {
  const classes = useFormStyles();

  const snackbar = useSnackbar();

  const { data, loading, error } = useMeQuery();
  const [updateUser] = useUpdateUserMutation();
  const [changePassword] = useChangePasswordMutation();

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !data?.me) {
    return <div>Error</div>;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          My profile
        </Typography>

        <Formik
          initialValues={{
            name: data.me.name,
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(4, "Name should be at least 4 letters long!")
              .max(40, "Name shouldn't be longer than 40 letters!")
              .required("Please enter your name!"),
          })}
          onSubmit={async (values) => {
            try {
              await updateUser({
                variables: {
                  input: {
                    name: values.name,
                  },
                },
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: "Query",
                      me: data?.updateUser!,
                    },
                  });
                },
              });

              snackbar.showMessage("Profile updated!");
            } catch (e) {
              snackbar.showMessage(NETWORK_ERROR);
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form className={classes.form} onSubmit={handleSubmit}>
              <MyTextInput label="Your name" name="name" />

              <Button
                type="submit"
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Update profile
              </Button>
            </form>
          )}
        </Formik>

        <Box mt={2}></Box>

        <Typography component="h1" variant="h5">
          Change password
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
          onSubmit={async (values) => {
            try {
              await changePassword({
                variables: {
                  input: {
                    password: values.password,
                  },
                },
              });

              snackbar.showMessage("Password updated!");
            } catch (e) {
              snackbar.showMessage(NETWORK_ERROR);
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form className={classes.form} onSubmit={handleSubmit}>
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
                Update password
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default Profile;
