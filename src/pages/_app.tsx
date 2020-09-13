import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { CssBaseline, Box } from "@material-ui/core";
import { SnackbarProvider } from "material-ui-snackbar-provider";
import NavBar from "../components/Navbar";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useRouter } from "next/router";

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      UserOnProject: {
        keyFields: ["userId", "projectId"],
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

function MyApp({ Component, pageProps }: any) {
  const router = useRouter();
  const isRoot = router.pathname === "/";

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <SnackbarProvider SnackbarProps={{ autoHideDuration: 4000 }}>
        <ApolloProvider client={client}>
          <CssBaseline />
          <NavBar />
          <Box mt={isRoot ? 0 : 11}>
            <Component {...pageProps} />
          </Box>
        </ApolloProvider>
      </SnackbarProvider>
    </MuiPickersUtilsProvider>
  );
}

export default MyApp;
