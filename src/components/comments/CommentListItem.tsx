import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Formik } from "formik";
import { useSnackbar } from "material-ui-snackbar-provider";
import React, { useState } from "react";
import * as Yup from "yup";
import { useUpdateCommentMutation } from "../../generated/graphql";
import { GraphqlProjectCapabilities } from "../../pages/my-projects";
import { formatTimestamp } from "../../utils/dateFormat";
import { GraphqlComment } from "../../utils/taskRenderingUtils";
import { NETWORK_ERROR } from "../../utils/texts";
import { useCommonStyles } from "../../utils/useCommonStyles";
import { MyTextInput } from "../MyTextInput";

interface CommentListItemProps {
  comment: GraphqlComment;
  capabilities: GraphqlProjectCapabilities;
  userId: number;
  onDelete(): void;
}

const useStyles = makeStyles(() => ({
  preLine: {
    whiteSpace: "pre-line",
  },
}));

export const CommentListItem: React.FC<CommentListItemProps> = ({
  comment,
  capabilities,
  userId,
  onDelete,
}) => {
  const styles = useStyles();
  const commonStyles = useCommonStyles();
  const snackbar = useSnackbar();

  const [updateComment] = useUpdateCommentMutation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [editMode, setEditMode] = useState<boolean>(false);

  const isMyComment = comment.author.id === userId;

  const canUpdateComment = isMyComment || capabilities.canUpdateOtherComments;
  const canDeleteComment = isMyComment || capabilities.canDeleteOtherComments;

  const menuVisible = canUpdateComment || canDeleteComment;

  let commentElement = null;
  if (editMode) {
    commentElement = (
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          comment: comment.content,
        }}
        validationSchema={Yup.object({
          comment: Yup.string().required("Please enter comment!"),
        })}
        onSubmit={async (values) => {
          try {
            await updateComment({
              variables: {
                id: comment.id,
                input: {
                  content: values.comment,
                },
              },
            });

            setEditMode(false);
            snackbar.showMessage("Comment updated!");
          } catch (e) {
            console.log(e);
            snackbar.showMessage(NETWORK_ERROR);
            return;
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <MyTextInput
              multiline
              label="Your comment"
              name="comment"
              type="comment"
            />

            <Box mt={1} mb={3} display="flex">
              <Button type="submit" disabled={isSubmitting}>
                Update
              </Button>
              <Button color="secondary" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    );
  } else {
    commentElement = (
      <Typography className={styles.preLine}>{comment.content}</Typography>
    );
  }

  return (
    <>
      <ListItem alignItems="flex-start" key={comment.id}>
        <ListItemAvatar>
          <Tooltip title={comment.author.name} placement="top">
            <Avatar>{comment.author.name[0].toUpperCase()}</Avatar>
          </Tooltip>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="subtitle1" color="textSecondary">
              {formatTimestamp(comment.createdAt)}
            </Typography>
          }
          secondary={commentElement}
        />

        {menuVisible && (
          <ListItemSecondaryAction className={commonStyles.topMenuItem}>
            <IconButton edge="end" aria-label="actions" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {canUpdateComment && (
                <MenuItem
                  onClick={() => {
                    setEditMode(true);
                    handleClose();
                  }}
                >
                  Edit
                </MenuItem>
              )}
              {canDeleteComment && (
                <MenuItem
                  onClick={() => {
                    onDelete();
                    handleClose();
                  }}
                >
                  Delete
                </MenuItem>
              )}
            </Menu>
          </ListItemSecondaryAction>
        )}
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};
