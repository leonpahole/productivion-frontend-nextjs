import {
  Box,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useRouter } from "next/router";
import { GraphqlProjectCapabilities } from "../../pages/my-projects";
import {
  dueDateColorWarning,
  getCompletedTextStyle,
  GraphqlTask,
  renderDueDate,
} from "../../utils/taskRenderingUtils";
import { useCommonStyles } from "../../utils/useCommonStyles";
import { TaskCompleteCheckbox } from "./TaskCompleteCheckbox";
import { useState } from "react";

const useStyles = makeStyles({
  completed: {
    textDecoration: "line-through",
  },
});

interface TaskListItemProps {
  projectId: number;
  task: GraphqlTask;
  capabilities: GraphqlProjectCapabilities;
  onEdit(): void;
  onDelete(): void;
}

export const TaskListItem: React.FC<TaskListItemProps> = ({
  projectId,
  task,
  capabilities,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();
  const styles = useStyles();
  const commonStyles = useCommonStyles();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ListItem key={task.id}>
        <ListItemIcon>
          <Box display="flex">
            <TaskCompleteCheckbox
              capabilities={capabilities}
              projectId={projectId}
              task={task}
            />
          </Box>
        </ListItemIcon>

        <ListItemText
          primaryTypographyProps={{
            className: commonStyles.wordWrap,
            style: {
              whiteSpace: "normal",
              textDecoration: getCompletedTextStyle(task),
              cursor: "pointer",
            },
          }}
          onClick={() => {
            router.push(`/project/${projectId}/task/${task.id}`);
          }}
          primary={`${task.title}`}
          secondary={renderDueDate(task)}
          secondaryTypographyProps={{
            style: {
              color: dueDateColorWarning(task),
              cursor: "pointer",
            },
          }}
          className={task.completed ? styles.completed : ""}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="actions" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {capabilities.canUpdateTask && (
              <MenuItem
                onClick={() => {
                  onEdit();
                  handleClose();
                }}
              >
                Edit
              </MenuItem>
            )}

            {capabilities.canDeleteTask && (
              <MenuItem
                onClick={() => {
                  onDelete();
                  handleClose();
                }}
              >
                Delete
              </MenuItem>
            )}
          </Menu>
        </ListItemSecondaryAction>
      </ListItem>
    </>
  );
};
