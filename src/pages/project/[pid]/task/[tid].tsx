import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Fab,
  List,
  Tooltip,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { NotFound } from "../../../../components/NotFound";
import { ProjectDisplay } from "../../../../components/projects/ProjectDisplay";
import { DeleteTaskDialog } from "../../../../components/tasks/DeleteTaskDialog";
import { TaskListItem } from "../../../../components/tasks/TaskListItem";
import { UpdateTaskDialog } from "../../../../components/tasks/UpdateTaskDialog";
import { useProjectQuery, useTaskQuery } from "../../../../generated/graphql";
import { CreateTaskDialog } from "../../../../components/tasks/CreateTaskDialog";
import { TaskList } from "../../../../components/tasks/TaskList";
import ChatIcon from "@material-ui/icons/Chat";
import { CommentsDrawer } from "../../../../components/comments/CommentsDrawer";
import { useCommonStyles } from "../../../../utils/useCommonStyles";

const TaskView: NextPage<{ projectId: number; taskId: number }> = ({
  projectId,
  taskId,
}) => {
  const router = useRouter();
  const commonStyles = useCommonStyles();

  const {
    data: taskData,
    loading: taskLoading,
    error: taskError,
  } = useTaskQuery({
    variables: { id: taskId, projectId },
  });

  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
  } = useProjectQuery({
    variables: { id: projectId },
  });

  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);

  if (taskLoading || projectLoading) {
    return <CircularProgress />;
  }

  if (
    taskError ||
    projectError ||
    !taskData ||
    !projectData ||
    !taskData.task ||
    !projectData.project
  ) {
    return <NotFound />;
  }

  const task = taskData.task;
  const project = projectData.project;

  return (
    <>
      <Container component="main" maxWidth="md">
        <Box mb={2}>
          <ProjectDisplay showSubheader={false} project={project} />

          <List>
            <TaskListItem
              task={task}
              projectId={project.id}
              capabilities={project.capabilities}
              onDelete={() => {}}
              onEdit={() => {}}
            />
          </List>

          <Box ml={3} mb={2}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              className={commonStyles.wordWrap}
            >
              {task.description}
            </Typography>
          </Box>

          <Divider />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          flexDirection="column"
        >
          <Typography variant="subtitle1" color="textSecondary">
            Subtasks
          </Typography>

          <Box mt={2} display="flex">
            <Tooltip title="Add subtask" placement="top">
              <Fab
                color="primary"
                onClick={() => {
                  setCreateTaskDialogOpen(true);
                }}
              >
                <AddIcon />
              </Fab>
            </Tooltip>

            <Box ml={2}>
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

          <TaskList project={project} parentTask={task} />
        </Box>
      </Container>
      {project.capabilities.canAddTask && (
        <CreateTaskDialog
          open={createTaskDialogOpen}
          project={project}
          task={task}
          onClose={() => {
            setCreateTaskDialogOpen(false);
          }}
        />
      )}
      {project.capabilities.canUpdateTask && (
        <UpdateTaskDialog
          open={editTaskDialogOpen}
          task={task}
          project={project}
          onClose={() => {
            setEditTaskDialogOpen(false);
          }}
        />
      )}
      {project.capabilities.canDeleteTask && (
        <DeleteTaskDialog
          open={deleteTaskDialogOpen}
          projectId={projectId}
          task={task}
          onClose={(deleted: boolean) => {
            setDeleteTaskDialogOpen(false);
            if (deleted) {
              router.push(`/project/${projectId}`);
            }
          }}
        />
      )}

      <CommentsDrawer
        open={commentsDrawerOpen}
        project={project}
        task={task}
        onClose={() => setCommentsDrawerOpen(false)}
      />
    </>
  );
};

TaskView.getInitialProps = ({ query }) => {
  return {
    projectId: Number(query.pid),
    taskId: Number(query.tid),
  };
};

export default TaskView;
