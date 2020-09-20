import { Box, Button, makeStyles, Theme, Typography } from "@material-ui/core";
import { ButtonLink } from "../components/ButtonLink";
import { useMeQuery } from "../generated/graphql";
import { Loading } from "../components/shared/Loading";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: theme.spacing(18),
    padding: theme.spacing(6),
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      marginTop: theme.spacing(5),
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(4),
      marginTop: theme.spacing(0),
    },
    ["@media (max-height:850px)"]: {
      marginTop: theme.spacing(10),
    },
    ["@media (max-height:750px)"]: {
      marginTop: theme.spacing(1),
    },
  },
  textBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 500,
    marginRight: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
      marginRight: theme.spacing(0),
      marginBottom: theme.spacing(6),
      alignItems: "center",
      maxWidth: "unset",
    },
  },
  heading: {
    textAlign: "left",
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },
  imageBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: theme.spacing(5),
    maxWidth: 750,
    [theme.breakpoints.down("md")]: {
      maxWidth: "unset",
      marginLeft: theme.spacing(0),
    },
  },
  image: {
    width: "100%",
    height: "auto",
  },
}));

export default function Home() {
  const { data, loading, error } = useMeQuery();
  const styles = useStyles();

  if (loading) {
    return <Loading />;
  }

  const notLoggedIn = error || !data?.me;

  return (
    <Box className={styles.root}>
      <Box className={styles.textBox}>
        <Box mb={3}>
          <Typography variant="h2" className={styles.heading}>
            A simple way to manage your tasks.
          </Typography>
        </Box>
        <Typography variant="h4" className={styles.heading}>
          ProductiviON helps you and your team to organize tasks.
        </Typography>

        {notLoggedIn && (
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              component={ButtonLink}
              href="/register"
            >
              Create a free account
            </Button>
          </Box>
        )}
      </Box>

      <Box className={styles.imageBox}>
        <img className={styles.image} src="/todo-landing.png" />
      </Box>
    </Box>
  );
}
