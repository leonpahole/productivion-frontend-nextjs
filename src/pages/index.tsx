import {
  makeStyles,
  Grid,
  Theme,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { ButtonLink } from "../components/ButtonLink";
import { useMeQuery } from "../generated/graphql";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100vh",
    background: theme.palette.primary.main,
    color: "white",
  },
}));

export default function Home() {
  const classes = useStyles();
  const { data, loading, error } = useMeQuery();

  if (loading) {
    return <CircularProgress />;
  }

  const notLoggedIn = error || !data?.me;

  return (
    <Grid
      justify="center"
      alignItems="center"
      direction="column"
      container
      component="main"
      className={classes.root}
    >
      <Typography variant="h1" component="h2">
        ProductiviON
      </Typography>

      {notLoggedIn && (
        <Grid>
          <Button component={ButtonLink} href="/register" color="inherit">
            Register
          </Button>

          <Button component={ButtonLink} href="/login" color="inherit">
            Login
          </Button>
        </Grid>
      )}

      {!notLoggedIn && (
        <Grid>
          <Button component={ButtonLink} href="/my-projects" color="inherit">
            My projects
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
