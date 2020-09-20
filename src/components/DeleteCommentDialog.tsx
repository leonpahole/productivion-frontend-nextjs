import { Button, CircularProgress } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSnackbar } from "material-ui-snackbar-provider";
import React from "react";
import { Task, useDeleteCommentMutation } from "../generated/graphql";
import { GraphqlComment } from "../utils/taskRenderingUtils";
import { NETWORK_ERROR } from "../utils/texts";

interface DeleteCommentDialogProps {
  open: boolean;
  comment: GraphqlComment | null;
  projectId: number;
  onClose(): void;
}

export const DeleteCommentDialog: React.FC<DeleteCommentDialogProps> = ({
  open,
  comment,
  onClose,
  projectId,
}) => {
  const snackbar = useSnackbar();
  const [deleteComment, { loading }] = useDeleteCommentMutation();

  const handleClose = async (confirm: boolean) => {
    if (confirm && comment) {
      try {
        await deleteComment({
          variables: { id: comment.id, projectId },
          update: (cache, { data }) => {
            if (data?.deleteComment) {
              cache.modify({
                fields: {
                  comments(existingCommentRefs: Task[] = [], { readField }) {
                    return existingCommentRefs.filter((taskRef) => {
                      return comment.id !== readField("id", taskRef);
                    });
                  },
                },
              });
            }
          },
        });
        snackbar.showMessage(`Comment deleted!`);
      } catch (e) {
        snackbar.showMessage(NETWORK_ERROR);
      }
    }

    onClose();
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
          {loading || !comment ? (
            <CircularProgress />
          ) : (
            <DialogContentText>Delete comment?</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            color="primary"
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
