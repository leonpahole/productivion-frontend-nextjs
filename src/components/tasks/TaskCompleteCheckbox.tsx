import { Checkbox } from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useCompleteTaskMutation } from "../../generated/graphql";
import { GraphqlProjectCapabilities } from "../../pages/my-projects";
import { GraphqlTask } from "../../utils/taskRenderingUtils";
import { NETWORK_ERROR } from "../../utils/texts";

interface TaskCompleteCheckboxProps {
  task: GraphqlTask;
  capabilities: GraphqlProjectCapabilities;
  projectId: number;
}

export const TaskCompleteCheckbox: React.FC<TaskCompleteCheckboxProps> = ({
  task,
  capabilities,
  projectId,
}) => {
  const [completeTask, { loading }] = useCompleteTaskMutation();
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

  const labelId = `checkbox-list-secondary-label-${task.id}`;

  return (
    <Checkbox
      edge="end"
      inputProps={{
        "aria-labelledby": labelId,
      }}
      checked={task.completed}
      disabled={!capabilities.canCompleteTask || loading}
      onChange={(event) =>
        onTaskChecked(task.id, task.title, event.target.checked)
      }
    />
  );
};
