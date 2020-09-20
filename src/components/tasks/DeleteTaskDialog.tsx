import { Button, CircularProgress } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { GraphqlTask } from "../../utils/taskRenderingUtils";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useDeleteTaskMutation, Task } from "../../generated/graphql";
import { NETWORK_ERROR } from "../../utils/texts";

interface DeleteTaskDialogProps {
  open: boolean;
  task: GraphqlTask | null;
  projectId: number;
  onClose(deleted: boolean): void;
}

export const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({
  open,
  task,
  onClose,
  projectId,
}) => {
  const snackbar = useSnackbar();
  const [deleteTask, { loading }] = useDeleteTaskMutation();

  const handleClose = async (confirm: boolean) => {
    if (confirm && task) {
      try {
        await deleteTask({
          variables: { id: task.id, projectId },
          update: (cache, { data }) => {
            if (data?.deleteTask) {
              cache.evict({ id: cache.identify(task) });
            }
          },
        });
        snackbar.showMessage(`Task ${task.title} deleted!`);
      } catch (e) {
        snackbar.showMessage(NETWORK_ERROR);
      }

      onClose(true);
    } else {
      onClose(false);
    }
  };

  return (
    <div>
      <Dialog
        maxWidth={"md"}
        fullWidth={true}
        open={open}
        onClose={() => {
          handleClose(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Confirm delete</DialogTitle>
        <DialogContent>
          {loading || !task ? (
            <CircularProgress />
          ) : (
            <DialogContentText>Delete task {task.title}?</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            color="default"
            disabled={loading}
          >
            No
          </Button>
          <Button
            onClick={() => {
              handleClose(true);
            }}
            color="secondary"
            disabled={loading}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
