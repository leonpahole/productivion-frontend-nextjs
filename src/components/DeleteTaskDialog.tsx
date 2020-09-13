import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { GraphqlTask } from "../utils/taskRenderingUtils";

interface DeleteTaskDialogProps {
  open: boolean;
  task: GraphqlTask | null;
  onClose(confirm: boolean): void;
}

export const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({
  open,
  task,
  onClose,
}) => {
  const handleClose = (confirm: boolean) => {
    onClose(confirm);
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
          <DialogContentText>Delete task {task?.title}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              handleClose(true);
            }}
            color="secondary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
