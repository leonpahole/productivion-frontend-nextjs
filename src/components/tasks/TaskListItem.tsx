import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useRouter } from "next/router";
import { GraphqlProjectCapabilities } from "../../pages/my-projects";
import {
  dueDateColorWarning,
  getCompletedTextStyle,
  GraphqlTask,
  renderDueDate,
} from "../../utils/taskRenderingUtils";
import { TaskCompleteCheckbox } from "./TaskCompleteCheckbox";

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

  return (
    <>
      <ListItem key={task.id}>
        <ListItemIcon>
          <TaskCompleteCheckbox
            capabilities={capabilities}
            projectId={projectId}
            task={task}
          />
        </ListItemIcon>

        <ListItemText
          primaryTypographyProps={{
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
          {capabilities.canUpdateTask && (
            <IconButton onClick={onEdit} edge="end" aria-label="edit">
              <EditIcon />
            </IconButton>
          )}

          {capabilities.canDeleteTask && (
            <IconButton
              onClick={onDelete}
              edge="end"
              aria-label="delete"
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </>
  );
};
