import {
  Checkbox,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useCompleteTaskMutation, useTasksQuery } from "../generated/graphql";
import {
  dueDateColorWarning,
  getCompletedTextStyle,
  renderDueDate,
  GraphqlTask,
} from "../utils/taskRenderingUtils";
import { NETWORK_ERROR } from "../utils/texts";
import { GraphqlProjectCapabilities } from "../pages/my-projects";

interface TaskListProps {
  projectId: number;
  onTaskDelete(task: GraphqlTask): void;
  onTaskEdit(task: GraphqlTask): void;
  capabilities: GraphqlProjectCapabilities;
}

const useTaskStyles = makeStyles({
  completed: {
    textDecoration: "line-through",
  },
});

export const TaskList: React.FC<TaskListProps> = ({
  projectId,
  onTaskDelete,
  onTaskEdit,
  capabilities,
}) => {
  const { data, loading, error } = useTasksQuery({
    variables: { projectId, parentTaskId: null },
  });

  const classes = useTaskStyles();

  const [completeTask] = useCompleteTaskMutation();
  const snackbar = useSnackbar();

  const onTaskChecked = async (
    taskId: number,
    taskTitle: string,
    state: boolean
  ) => {
    try {
      const result = await completeTask({
        variables: { id: taskId, projectId, isCompleted: state },
      });

      if (result.data?.completeTask) {
        let stateStr = result.data?.completeTask.completed
          ? "completed"
          : "uncompleted";
        snackbar.showMessage(`Task ${taskTitle} marked ${stateStr}!`);
      }
    } catch (e) {
      snackbar.showMessage(NETWORK_ERROR);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error != null || data?.tasks == null) {
    return null;
  }

  return (
    <List>
      {data.tasks.map((task) => {
        const labelId = `checkbox-list-secondary-label-${task.id}`;
        return (
          <ListItem key={task.id}>
            <ListItemText
              id={labelId}
              primaryTypographyProps={{
                style: {
                  whiteSpace: "normal",
                  textDecoration: getCompletedTextStyle(task),
                },
              }}
              primary={`${task.title}`}
              secondary={renderDueDate(task)}
              secondaryTypographyProps={{
                style: { color: dueDateColorWarning(task) },
              }}
              className={task.completed ? classes.completed : ""}
            />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                inputProps={{ "aria-labelledby": labelId }}
                checked={task.completed}
                disabled={!capabilities.canCompleteTask}
                onChange={(event) =>
                  onTaskChecked(task.id, task.title, event.target.checked)
                }
              />
              {capabilities.canUpdateTask && (
                <IconButton
                  onClick={() => {
                    onTaskEdit(task);
                  }}
                  edge="end"
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
              )}

              {capabilities.canDeleteTask && (
                <IconButton
                  onClick={() => {
                    onTaskDelete(task);
                  }}
                  edge="end"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};
