import { makeStyles } from "@material-ui/core";

export const useCommonStyles = makeStyles((theme) => ({
  heading: {
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.typography.h3.fontSize,
    },
  },
  cursorPointer: {
    cursor: "pointer",
  },
  wordWrap: {
    overflowWrap: "break-word",
  },
  topMenuItem: {
    top: "0%",
    marginTop: "30px",
  },
}));
