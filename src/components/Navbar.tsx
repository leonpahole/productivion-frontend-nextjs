import { useApolloClient } from "@apollo/client";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  ListItem,
  Theme,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import { useRouter } from "next/router";
import { useState } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { ButtonLink } from "./ButtonLink";

const useStyles = makeStyles((theme: Theme) => ({
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
  navButtonBox: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  appNameHeading: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  appBar: {
    boxShadow: "unset",
  },
  drawerContainer: {
    width: 250,
  },
  drawerHeadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 64 + theme.spacing(3),
  },
  linkButton: {
    color: "black",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
}));

class MenuOption {
  name: string;
  href: string;
  isButton: boolean;
  visibleInNav: boolean;
  visibleInDrawer: boolean;

  constructor(
    name: string,
    href: string,
    isButton: boolean = false,
    visibleInNav: boolean = true,
    visibleInDrawer: boolean = true
  ) {
    this.name = name;
    this.href = href;
    this.isButton = isButton;
    this.visibleInNav = visibleInNav;
    this.visibleInDrawer = visibleInDrawer;
  }
}

const generateNavbarButtons = (
  menuOptions: MenuOption[],
  linkButtonClass: string
) => {
  return (
    <>
      {menuOptions
        .filter((m) => m.visibleInNav)
        .map((m, index) => (
          <Box ml={index > 0 ? 2 : 0} key={index}>
            <Button
              component={ButtonLink}
              href={m.href}
              color={m.isButton ? "primary" : "inherit"}
              variant={m.isButton ? "contained" : undefined}
              className={m.isButton ? undefined : linkButtonClass}
            >
              {m.name}
            </Button>
          </Box>
        ))}
    </>
  );
};

const generateDrawerButtons = (
  menuOptions: MenuOption[],
  linkButtonClass: string
) => {
  return (
    <>
      {menuOptions
        .filter((m) => m.visibleInDrawer)
        .map((m, index) => (
          <ListItem component={ButtonLink} href={m.href} key={index}>
            <Button
              color={m.isButton ? "primary" : "inherit"}
              variant={m.isButton ? "contained" : undefined}
              className={m.isButton ? undefined : linkButtonClass}
            >
              {m.name}
            </Button>
          </ListItem>
        ))}
    </>
  );
};

export default function NavBar() {
  const styles = useStyles();
  const router = useRouter();
  const { data, loading, error } = useMeQuery();
  const apolloClient = useApolloClient();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  if (loading) {
    return <div></div>;
  }

  let isLoggedIn = false;

  if (!error && data?.me) {
    isLoggedIn = true;
  }

  data?.me != null;

  let menuOptions: MenuOption[] = [];

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  // todo
  let logOutButton = null;

  if (isLoggedIn) {
    menuOptions = [
      new MenuOption("My projects", "/my-projects"),
      new MenuOption("Profile", "/profile"),
    ];

    logOutButton = (
      <Button
        disabled={logoutFetching}
        onClick={async () => {
          await logout();
          await apolloClient.resetStore();
          router.push("/login");
        }}
        className={styles.linkButton}
        color="inherit"
      >
        Log out
      </Button>
    );
  } else {
    menuOptions = [
      new MenuOption("Sign in", "/login"),
      new MenuOption("Create an account", "/register", true),
    ];
  }

  let navBarButtons = generateNavbarButtons(menuOptions, styles.linkButton);
  let drawerOptions = generateDrawerButtons(menuOptions, styles.linkButton);

  return (
    <div className={styles.root}>
      <AppBar
        position="static"
        color={isLoggedIn ? "primary" : "transparent"}
        className={styles.appBar}
      >
        <Box pt={1} pb={1}>
          <Toolbar className={styles.toolbar}>
            <Box>
              <IconButton color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Button
                className={styles.appNameHeading + " " + styles.linkButton}
                component={ButtonLink}
                href={data?.me ? "/my-projects" : "/"}
              >
                ProductiviON
              </Button>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              className={styles.navButtonBox}
            >
              {navBarButtons}
              <Box ml={2}>{logOutButton}</Box>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div
          className={styles.drawerContainer}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <ListItem
            button
            component={ButtonLink}
            href={data?.me ? "/my-projects" : "/"}
            className={styles.drawerHeadingContainer}
          >
            <Button className={styles.linkButton}>PRODUCTIVION</Button>
          </ListItem>
          <Divider />
          {drawerOptions}
          <ListItem>{logOutButton}</ListItem>
        </div>
      </Drawer>
    </div>
  );
}
