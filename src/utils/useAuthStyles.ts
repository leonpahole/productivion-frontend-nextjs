import { makeStyles } from "@material-ui/core";

export const useAuthStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    maxWidth: 600,
  },
  formHeading: {
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.typography.h3.fontSize,
    },
  },
  heading: {
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.typography.h4.fontSize,
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  imageContainer: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}));
