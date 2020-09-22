import {
  Box,
  Drawer,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { GraphqlProject } from "../../pages/my-projects";
import { GraphqlTask } from "../../utils/taskRenderingUtils";
import { useCommonStyles } from "../../utils/useCommonStyles";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

interface CommentsDrawerProps {
  project: GraphqlProject;
  task?: GraphqlTask | null;
  open: boolean;
  onClose(): void;
}

const useStyles = makeStyles((theme: Theme) => ({
  list: {
    minWidth: 250,
    overflow: "auto",
    width: "30vw",
    [theme.breakpoints.down("md")]: {
      width: "40vw",
    },
    [theme.breakpoints.down("sm")]: {
      width: "50vw",
    },
    [theme.breakpoints.down("sm")]: {
      width: "60vw",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100vw",
    },
  },
  fullList: {
    width: "auto",
  },
  closeButton: {
    padding: "unset",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  drawerHeaderContainer: {
    width: "100%",
    overflow: "auto",
  },
}));

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  open,
  onClose,
  project,
  task = null,
}) => {
  const styles = useStyles();
  const commonStyles = useCommonStyles();

  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <Box className={styles.list} p={2}>
        <Box display="flex" justifyContent="space-between">
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            className={styles.drawerHeaderContainer}
          >
            <Typography variant="h5">Discussion</Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              className={commonStyles.wordWrap}
            >
              Project: {project.title}
            </Typography>
            {task && (
              <Typography
                variant="subtitle1"
                color="textSecondary"
                className={commonStyles.wordWrap}
              >
                Task: {task.title}
              </Typography>
            )}
          </Box>
          <Box>
            <IconButton className={styles.closeButton}>
              <CloseIcon onClick={onClose} />
            </IconButton>
          </Box>
        </Box>
        <CommentInput
          projectId={project.id}
          taskId={task ? task.id : undefined}
        />
        <CommentList
          projectId={project.id}
          taskId={task ? task.id : undefined}
          capabilities={project.capabilities}
        />
      </Box>
    </Drawer>
  );
};
