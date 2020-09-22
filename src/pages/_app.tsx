import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import MomentUtils from "@date-io/moment";
import { Box, CssBaseline, makeStyles } from "@material-ui/core";
import { amber, red } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { SnackbarProvider } from "material-ui-snackbar-provider";
import { useRouter } from "next/router";
import NavBar from "../components/Navbar";

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      UserOnProject: {
        keyFields: ["projectId", "user", ["id"]],
      },
    },
  }),
  link: createHttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
  }),
  defaultOptions: {
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
    watchQuery: {
      errorPolicy: "all",
    },
  },
});

const theme = createMuiTheme({
  palette: {
    primary: amber,
    secondary: red,
  },
});

const useStyles = makeStyles((theme) => ({
  rootContainer: () => ({
    marginTop: theme.spacing(5),
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(2),
    },
  }),
}));

const dontShowNavRoutes = ["/login", "/register"];
const noMarginOnContainerRoutes = ["/", "/login", "/register"];

function MyApp({ Component, pageProps }: any) {
  const router = useRouter();
  const currentRoute = router.pathname;

  console.log(currentRoute);

  const dontShowNav = dontShowNavRoutes.some((r) => r === currentRoute);
  const nomarginOnContainer = noMarginOnContainerRoutes.some(
    (r) => r === currentRoute
  );

  const styles = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <SnackbarProvider SnackbarProps={{ autoHideDuration: 4000 }}>
          <ApolloProvider client={client}>
            <CssBaseline />
            {!dontShowNav && <NavBar />}
            <Box className={nomarginOnContainer ? "" : styles.rootContainer}>
              <Component {...pageProps} />
            </Box>
          </ApolloProvider>
        </SnackbarProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default MyApp;
