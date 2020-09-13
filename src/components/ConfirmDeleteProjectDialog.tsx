import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";

interface ConfirmDeleteProjectDialogProps {
  open: boolean;
  onClose(confirmed: boolean): void;
  projectTitle: string;
}

export const ConfirmDeleteProjectDialog: React.FC<ConfirmDeleteProjectDialogProps> = ({
  open,
  onClose,
  projectTitle,
}) => {
  const [retypeProjectTitle, setRetypeProjectName] = useState("");
  const [allowDelete, setAllowDelete] = useState(false);

  useEffect(() => {
    if (projectTitle === retypeProjectTitle) {
      setAllowDelete(true);
    } else {
      setAllowDelete(false);
    }
  }, [retypeProjectTitle]);

  const handleClose = (confirmed: boolean) => {
    onClose(confirmed);
    setRetypeProjectName("");
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
        <DialogTitle id="form-dialog-title">Delete project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete project <b>{projectTitle}</b>?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Retype project title to confirm delete"
            type="email"
            value={retypeProjectTitle}
            onChange={(e) => setRetypeProjectName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose(true);
            }}
            disabled={!allowDelete}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
