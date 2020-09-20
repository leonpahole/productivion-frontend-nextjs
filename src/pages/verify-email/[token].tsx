import {
  Container,
  Typography,
  Box,
  makeStyles,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useVerifyEmailMutation } from "../../generated/graphql";

import { ButtonLink } from "../../components/ButtonLink";
import { useSnackbar } from "material-ui-snackbar-provider";
import { NETWORK_ERROR } from "../../utils/texts";
import { ValueType } from "../../utils/valueType";

const useStyles = makeStyles(() => ({
  image: {
    width: "100%",
    height: "auto",
    maxWidth: 400,
  },
}));

const VerifyEmail: NextPage<{ token: string }> = ({ token }) => {
  const [verifyEmail, { loading, error }] = useVerifyEmailMutation();
  const styles = useStyles();
  const [verifyError, setVerifyError] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const snackbar = useSnackbar();

  useEffect(() => {
    const runVerifyEmail = async () => {
      let result: null | ValueType<ReturnType<typeof verifyEmail>> = null;

      try {
        result = await verifyEmail({
          variables: {
            input: {
              token,
            },
          },
        });
      } catch (e) {
        setVerifyError(true);
        snackbar.showMessage(NETWORK_ERROR);
      }

      if (!result || !result.data || !result.data.verifyEmail) {
        setVerifyError(true);
        return;
      }

      setUsername(result.data.verifyEmail.name);
    };

    runVerifyEmail();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  const isError = verifyError || error != null;

  return (
    <Container component="main" maxWidth="sm">
      <Typography component="h1" variant="h2" align="center">
        {isError ? "Something went wrong!" : `Email verified, ${username}!`}
      </Typography>
      <Box mt={3} mb={4} display="flex" justifyContent="center">
        <img
          className={styles.image}
          src={isError ? "/todo-verify-failed.png" : "/todo-verify.png"}
        />
      </Box>
      <Box>
        <Typography component="h2" variant="subtitle1" align="center">
          {isError
            ? "Your account could not be verified. Please try again later."
            : "You can now use ProductiviON. Start by signing in."}
        </Typography>
      </Box>

      <Box mt={2} display="flex" justifyContent="center">
        <Button
          component={ButtonLink}
          href={isError ? "/" : "/login"}
          color="primary"
          variant="contained"
        >
          {isError ? "Go to home page" : "Sign in"}
        </Button>
      </Box>
    </Container>
  );
};

VerifyEmail.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default VerifyEmail;
