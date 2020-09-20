import {
  Box,
  Button,
  Container,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { ButtonLink } from "./ButtonLink";

const useStyles = makeStyles((theme) => ({
  heading: {
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.typography.h3.fontSize,
    },
  },
  image: {
    width: "100%",
    height: "auto",
    maxWidth: 200,
  },
}));

export const NotFound: React.FC<{}> = ({}) => {
  const styles = useStyles();

  return (
    <>
      <Container component="main" maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          className={styles.heading}
        >
          Not found...
        </Typography>
        <Box mt={3} mb={4} display="flex" justifyContent="center">
          <img className={styles.image} src="/todo-not-found.png" />
        </Box>
        <Box>
          <Typography component="h2" variant="subtitle1" align="center">
            The requested page could not be found.
          </Typography>
        </Box>
        <Box mt={2} display="flex" justifyContent="center">
          <Button
            component={ButtonLink}
            href="/"
            color="primary"
            variant="contained"
          >
            Back to home
          </Button>
        </Box>
      </Container>
    </>
  );
};
