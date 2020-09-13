import { useApolloClient } from "@apollo/client";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { ButtonLink } from "./ButtonLink";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const router = useRouter();
  const { data, loading, error } = useMeQuery();
  const apolloClient = useApolloClient();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();

  if (loading) {
    return <div></div>;
  }

  let isLoggedIn = false;

  if (!error && data?.me) {
    isLoggedIn = true;
  }

  data?.me != null;

  let navBarButtons = null;

  if (isLoggedIn) {
    navBarButtons = (
      <>
        <Button component={ButtonLink} href="/my-projects" color="inherit">
          My projects
        </Button>
        <Button component={ButtonLink} href="/create-project" color="inherit">
          Create a project
        </Button>
        <Button component={ButtonLink} href="/profile" color="inherit">
          Profile
        </Button>
        <Button
          disabled={logoutFetching}
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
            router.push("/");
          }}
          color="inherit"
        >
          Log out
        </Button>
      </>
    );
  } else {
    navBarButtons = (
      <>
        <Button component={ButtonLink} href="/login" color="inherit">
          Login
        </Button>
        <Button component={ButtonLink} href="/register" color="inherit">
          Register
        </Button>
      </>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <Button
            component={ButtonLink}
            href={data?.me ? "/my-projects" : "/"}
            color="inherit"
          >
            ProductiviON
          </Button>
          <div>{navBarButtons}</div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
