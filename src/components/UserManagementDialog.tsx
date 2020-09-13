import {
  AppBar,
  Button,
  CircularProgress,
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Slide,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSnackbar } from "material-ui-snackbar-provider";
import React, { useState } from "react";
import {
  useAddUserToProjectMutation,
  UserOnProjectSnippetFragmentDoc,
  UsersOnProjectQuery,
  useUsersOnProjectQuery,
  useRemoveUserFromProjectMutation,
  UserOnProject,
} from "../generated/graphql";
import { GraphqlProject } from "../pages/my-projects";
import { AppError } from "../types/AppError";
import { NETWORK_ERROR } from "../utils/texts";
import { renderRoleName, isAdmin } from "../utils/userUtils";
import {
  AddUserToProjectDialog,
  AddUserToProjectDialogResult,
} from "./AddUserToProjectDialog";

import EditIcon from "@material-ui/icons/Edit";
import { DeleteUserOnProjectDialog } from "./DeleteUserOnProjectDialog";

export type GraphqlUserOnProject = UsersOnProjectQuery["usersOnProject"][0];

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    root: {
      display: "flex",
    },
    formControl: {
      marginLeft: theme.spacing(2),
    },
  })
);

interface UserManagementDialogProps {
  project: GraphqlProject;
}

export const UserManagementDialog: React.FC<UserManagementDialogProps> = ({
  project,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const snackbar = useSnackbar();

  const [addUserToProjectDialogOpen, setAddUserToProjectDialogOpen] = useState(
    false
  );

  const [
    editUserToProjectDialogOpen,
    setEditUserToProjectDialogOpen,
  ] = useState(false);

  const [
    deleteUserOnProjectDialogOpen,
    setDeleteUserOnProjectDialogOpen,
  ] = useState(false);

  const [
    userOnProjectToDelete,
    setUserOnProjectToDelete,
  ] = useState<GraphqlUserOnProject | null>(null);

  const [
    userOnProjectToEdit,
    setUserOnProjectToEdit,
  ] = useState<GraphqlUserOnProject | null>(null);

  const { data, loading } = useUsersOnProjectQuery({
    variables: { id: project.id },
    skip: !open,
  });

  const [addUserToProject] = useAddUserToProjectMutation();
  const [removeUserFromProject] = useRemoveUserFromProjectMutation();

  const onUserOnProjectEdit = (userOnProject: GraphqlUserOnProject) => {
    setEditUserToProjectDialogOpen(true);
    setUserOnProjectToEdit(userOnProject);
  };

  const onUserOnProjectDelete = (userOnProject: GraphqlUserOnProject) => {
    setDeleteUserOnProjectDialogOpen(true);
    setUserOnProjectToDelete(userOnProject);
  };

  const onDeleteUserOnProjectDialogClose = async (confirmed: boolean) => {
    if (confirmed && userOnProjectToDelete) {
      try {
        const userIdToDelete = userOnProjectToDelete.userId;
        const projectIdToDelete = userOnProjectToDelete.projectId;
        await removeUserFromProject({
          variables: {
            id: project.id,
            userId: userOnProjectToDelete.user.id,
          },
          update: (cache, { data }) => {
            if (data?.removeUserFromProject) {
              cache.modify({
                fields: {
                  usersOnProject(
                    existingUsersOnproject: UserOnProject[] = [],
                    { readField }
                  ) {
                    return existingUsersOnproject.filter((userRef) => {
                      return !(
                        userIdToDelete === readField("userId", userRef) &&
                        projectIdToDelete === readField("projectId", userRef)
                      );
                    });
                  },
                },
              });
            }
          },
        });
        snackbar.showMessage(
          `User ${userOnProjectToDelete.user.name} deleted from project!`
        );
      } catch (e) {
        snackbar.showMessage(NETWORK_ERROR);
      }
    }

    setDeleteUserOnProjectDialogOpen(false);
    setUserOnProjectToDelete(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openAddUserToProjectDialog = () => {
    setAddUserToProjectDialogOpen(true);
  };

  const onAddUserToProjectDialogClose = async (
    result: AddUserToProjectDialogResult,
    setErrors?: any
  ) => {
    if (result) {
      try {
        const addUserToProjectResult = await addUserToProject({
          variables: {
            id: project.id,
            input: {
              email: result.email,
              capabilities: result.capabilities,
              rolePresetId:
                result.rolePresetId > 0 ? result.rolePresetId : null,
            },
          },
          update: (cache, { data }) => {
            if (result.isEdit) {
              return;
            }

            if (data && data.addUserToProject) {
              cache.modify({
                fields: {
                  usersOnProject(existingUsers = []) {
                    const newUserRef = cache.writeFragment({
                      data: data.addUserToProject,
                      variables: {
                        id: project.id,
                      },
                      fragment: UserOnProjectSnippetFragmentDoc,
                      fragmentName: "UserOnProjectSnippet",
                    });
                    return [newUserRef, ...existingUsers];
                  },
                },
              });
            }
          },
        });

        if (!addUserToProjectResult) {
          return;
        }

        if (
          addUserToProjectResult.errors &&
          addUserToProjectResult.errors.length > 0
        ) {
          const error = (addUserToProjectResult
            .errors[0] as unknown) as AppError;

          // todo
          if (error.type === "validation-error") {
            setErrors({
              email: "This email doesn't exist!",
            });
          }

          return;
        }

        if (!addUserToProjectResult.data?.addUserToProject) {
          return;
        }

        if (result.isEdit) {
          setEditUserToProjectDialogOpen(false);
          snackbar.showMessage(
            `User ${addUserToProjectResult.data.addUserToProject.user.name} edited!`
          );
        } else {
          setAddUserToProjectDialogOpen(false);
          snackbar.showMessage(
            `User ${addUserToProjectResult.data.addUserToProject.user.name} added to project!`
          );
        }
      } catch (e) {
        console.log(e);
        snackbar.showMessage(NETWORK_ERROR);
      }
    } else {
      setEditUserToProjectDialogOpen(false);
      setAddUserToProjectDialogOpen(false);
    }
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        User management
      </Button>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <div>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  User management - project {project.title}
                </Typography>
                <Button color="inherit" onClick={openAddUserToProjectDialog}>
                  Add a user
                </Button>
              </Toolbar>
            </AppBar>
            <List>
              {data?.usersOnProject.map((userOnProject) => {
                return (
                  <ListItem>
                    <ListItemText
                      primary={userOnProject.user.email}
                      secondary={renderRoleName(userOnProject.presetId)}
                    />
                    <ListItemSecondaryAction>
                      {!isAdmin(userOnProject.presetId) && (
                        <IconButton
                          onClick={() => {
                            onUserOnProjectDelete(userOnProject);
                          }}
                          edge="end"
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => {
                          onUserOnProjectEdit(userOnProject);
                        }}
                        edge="end"
                        aria-label="delete"
                      >
                        <EditIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>

            <AddUserToProjectDialog
              open={addUserToProjectDialogOpen}
              projectTitle={project.title}
              onClose={onAddUserToProjectDialogClose}
            />

            <AddUserToProjectDialog
              open={editUserToProjectDialogOpen}
              projectTitle={project.title}
              onClose={onAddUserToProjectDialogClose}
              userOnProject={userOnProjectToEdit}
            />

            <DeleteUserOnProjectDialog
              open={deleteUserOnProjectDialogOpen}
              onClose={onDeleteUserOnProjectDialogClose}
              userOnProject={userOnProjectToDelete}
            />
          </div>
        )}
      </Dialog>
    </div>
  );
};
