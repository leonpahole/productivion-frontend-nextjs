import { GraphqlProject } from "../../pages/my-projects";
import { useState } from "react";
import { ConfirmDeleteProjectDialog } from "./ConfirmDeleteProjectDialog";
import { UpdateProjectDialog } from "./UpdateProjectDialog";
import { Typography, Box, Fab, Tooltip } from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { UserManagementDialog } from "../UserManagementDialog";
import { CreateTaskDialog } from "../tasks/CreateTaskDialog";
import { useCommonStyles } from "../../utils/useCommonStyles";
import { pluralize } from "../../utils/pluralize";
import { useRouter } from "next/router";
import ChatIcon from "@material-ui/icons/Chat";
import { CommentsDrawer } from "../comments/CommentsDrawer";

interface ProjectDisplayProps {
  project: GraphqlProject;
  showSubheader?: boolean;
}

export const ProjectDisplay: React.FC<ProjectDisplayProps> = ({
  project,
  showSubheader = true,
}) => {
  const styles = useCommonStyles();
  const router = useRouter();

  const [deleteDialogOpen, setDeleteProjectDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateProjectDialogOpen] = useState(false);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [userManagementDialogOpen, setUserManagementDialogOpen] = useState(
    false
  );
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);

  let subheader = null;

  if (showSubheader) {
    subheader = (
      <>
        <Box
          mt={3}
          mb={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          {project.capabilities.canAddTask && (
            <Box m={1}>
              <Tooltip title="Add task" placement="top">
                <Fab
                  color="primary"
                  onClick={() => {
                    setCreateTaskDialogOpen(true);
                  }}
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
            </Box>
          )}

          {project.capabilities.canManageProjectUsers && (
            <Box m={1}>
              <Tooltip title="User management" placement="top">
                <Fab
                  color="primary"
                  onClick={() => {
                    setUserManagementDialogOpen(true);
                  }}
                >
                  <PeopleIcon />
                </Fab>
              </Tooltip>
            </Box>
          )}

          {project.capabilities.canUpdateProject && (
            <Box m={1}>
              <Tooltip title="Edit project" placement="top">
                <Fab
                  color="primary"
                  onClick={() => {
                    setUpdateProjectDialogOpen(true);
                  }}
                >
                  <EditIcon />
                </Fab>
              </Tooltip>
            </Box>
          )}

          {project.capabilities.canDeleteProject && (
            <Box m={1}>
              <Tooltip title="Delete project" placement="top">
                <Fab
                  color="secondary"
                  onClick={() => {
                    setDeleteProjectDialogOpen(true);
                  }}
                >
                  <DeleteIcon />
                </Fab>
              </Tooltip>
            </Box>
          )}

          <Box m={1}>
            <Tooltip title="Discussion" placement="top">
              <Fab
                color="primary"
                onClick={() => {
                  setCommentsDrawerOpen(true);
                }}
              >
                <ChatIcon />
              </Fab>
            </Tooltip>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography align="center" color="textSecondary" variant="subtitle1">
            {project.taskCount} {pluralize(project.taskCount, "task")}
          </Typography>
          <Box mr={1} ml={1}>
            <Typography align="center" color="textSecondary" variant="h6">
              &bull;
            </Typography>
          </Box>
          <Typography align="center" color="textSecondary" variant="subtitle1">
            {project.userCount} {pluralize(project.userCount, "collaborator")}
          </Typography>
        </Box>

        {project.capabilities.canAddTask && (
          <CreateTaskDialog
            open={createTaskDialogOpen}
            project={project}
            onClose={() => {
              setCreateTaskDialogOpen(false);
            }}
          />
        )}

        {project.capabilities.canManageProjectUsers && (
          <UserManagementDialog
            open={userManagementDialogOpen}
            project={project}
            onClose={() => setUserManagementDialogOpen(false)}
          />
        )}

        {project.capabilities.canUpdateProject && (
          <UpdateProjectDialog
            open={updateDialogOpen}
            project={project}
            onClose={() => setUpdateProjectDialogOpen(false)}
          />
        )}

        {project.capabilities.canDeleteProject && (
          <ConfirmDeleteProjectDialog
            open={deleteDialogOpen}
            project={project}
            onClose={() => setDeleteProjectDialogOpen(false)}
          />
        )}

        <CommentsDrawer
          open={commentsDrawerOpen}
          project={project}
          onClose={() => setCommentsDrawerOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <Box
        className={styles.cursorPointer}
        onClick={() => {
          router.push(`/project/${project.id}`);
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          className={styles.heading}
        >
          {project.title}
        </Typography>
        <Typography align="center" variant="subtitle1">
          {project.description}
        </Typography>
      </Box>

      {subheader}
    </>
  );
};
