import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";
import { GraphqlProject } from "../../pages/my-projects";
import { useDeleteProjectMutation, Project } from "../../generated/graphql";
import { useSnackbar } from "material-ui-snackbar-provider";
import { NETWORK_ERROR } from "../../utils/texts";

interface ConfirmDeleteProjectDialogProps {
  open: boolean;
  onClose(): void;
  project: GraphqlProject | null;
}

export const ConfirmDeleteProjectDialog: React.FC<ConfirmDeleteProjectDialogProps> = ({
  open,
  onClose,
  project,
}) => {
  const [retypeProjectTitle, setRetypeProjectName] = useState("");
  const [allowDelete, setAllowDelete] = useState(false);
  const [deleteProject] = useDeleteProjectMutation();
  const snackbar = useSnackbar();

  useEffect(() => {
    if (project && project.title === retypeProjectTitle) {
      setAllowDelete(true);
    } else {
      setAllowDelete(false);
    }
  }, [retypeProjectTitle]);

  const onConfirmOrClose = async (confirmed: boolean) => {
    let result = true;

    if (confirmed && project != null) {
      result = await onDeleteProject();
    }

    if (result) {
      onClose();
      setRetypeProjectName("");
    }
  };

  const onDeleteProject = async (): Promise<boolean> => {
    if (project != null) {
      try {
        await deleteProject({
          variables: { id: project.id },
          update: (cache, { data }) => {
            if (data?.deleteProject) {
              cache.modify({
                fields: {
                  myProjects(
                    existingProjectRefs: Project[] = [],
                    { readField }
                  ) {
                    return existingProjectRefs.filter((projectRef) => {
                      return project.id !== readField("id", projectRef);
                    });
                  },
                },
              });
            }
          },
        });

        snackbar.showMessage("Project deleted!");
        return true;
      } catch (e) {
        console.log(e);
        snackbar.showMessage(NETWORK_ERROR);
      }
    }

    return false;
  };

  if (!project) {
    return null;
  }

  return (
    <div>
      <Dialog
        maxWidth={"md"}
        fullWidth={true}
        open={open}
        onClose={() => {
          onConfirmOrClose(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete project <b>{project.title}</b>?
          </DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            variant="outlined"
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
              onConfirmOrClose(false);
            }}
            color="default"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirmOrClose(true);
            }}
            disabled={!allowDelete}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
