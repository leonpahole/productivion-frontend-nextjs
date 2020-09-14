import {
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
import { useTasksQuery } from "../generated/graphql";
import { GraphqlProjectCapabilities } from "../pages/my-projects";
import {
  dueDateColorWarning,
  getCompletedTextStyle,
  GraphqlTask,
  renderDueDate,
} from "../utils/taskRenderingUtils";
import { TaskCompleteCheckbox } from "./TaskCompleteCheckbox";

interface TaskListProps {
  projectId: number;
  onTaskDelete(task: GraphqlTask): void;
  onTaskEdit(task: GraphqlTask): void;
  onTaskClick(task: GraphqlTask): void;
  capabilities: GraphqlProjectCapabilities;
}

const useTaskStyles = makeStyles({
  completed: {
    textDecoration: "line-through",
  },
});

export const TaskList: React.FC<TaskListProps> = ({
  projectId,
  onTaskClick,
  onTaskDelete,
  onTaskEdit,
  capabilities,
}) => {
  const { data, loading, error } = useTasksQuery({
    variables: { projectId, parentTaskId: null },
  });

  const classes = useTaskStyles();

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
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                onTaskClick(task);
              }}
              primary={`${task.title}`}
              secondary={renderDueDate(task)}
              secondaryTypographyProps={{
                style: { color: dueDateColorWarning(task), cursor: "pointer" },
              }}
              className={task.completed ? classes.completed : ""}
            />
            <ListItemSecondaryAction>
              <TaskCompleteCheckbox
                capabilities={capabilities}
                projectId={projectId}
                task={task}
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
