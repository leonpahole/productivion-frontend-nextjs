import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { GraphqlUserOnProject } from "./UserManagementDialog";

interface DeleteUserOnProjectDialogProps {
  open: boolean;
  userOnProject: GraphqlUserOnProject | null;
  onClose(confirm: boolean): void;
}

export const DeleteUserOnProjectDialog: React.FC<DeleteUserOnProjectDialogProps> = ({
  open,
  userOnProject,
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
        <DialogTitle id="form-dialog-title">Confirm delete user</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete user {userOnProject?.user.name} from project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            color="default"
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
