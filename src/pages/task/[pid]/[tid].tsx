import {
  Button,
  CircularProgress,
  Container,
  IconButton,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { NextPage } from "next";
import React, { useState } from "react";
import { ButtonLink } from "../../../components/ButtonLink";
import { CreateTaskDialog } from "../../../components/CreateTaskDialog";
import { DeleteTaskDialog } from "../../../components/DeleteTaskDialog";
import { TaskCompleteCheckbox } from "../../../components/TaskCompleteCheckbox";
import { useProjectQuery, useTaskQuery } from "../../../generated/graphql";
import { useRouter } from "next/router";
import { renderDueDate } from "../../../utils/taskRenderingUtils";

const TaskView: NextPage<{ projectId: number; taskId: number }> = ({
  projectId,
  taskId,
}) => {
  const router = useRouter();

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

  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);

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
    return <div>Error</div>;
  }

  const task = taskData.task;
  const project = projectData.project;

  return (
    <>
      <Container component="main" maxWidth="md">
        <Button
          component={ButtonLink}
          href="/project/[pid]"
          as={`/project/${projectId}`}
          color="inherit"
        >
          Back to project
        </Button>

        <Typography component="h1" variant="h4">
          Task: {task.title}
        </Typography>
        <Typography variant="subtitle1">{task.description}</Typography>
        <Typography variant="subtitle2">{renderDueDate(task)}</Typography>

        <TaskCompleteCheckbox
          capabilities={project.capabilities}
          projectId={project.id}
          task={task}
        />

        {project.capabilities.canUpdateTask && (
          <IconButton
            onClick={() => {
              setEditTaskDialogOpen(true);
            }}
            edge="end"
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
        )}

        {project.capabilities.canDeleteTask && (
          <IconButton
            onClick={() => {
              setDeleteTaskDialogOpen(true);
            }}
            edge="end"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Container>
      {project.capabilities.canUpdateTask && (
        <CreateTaskDialog
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
          onClose={() => {
            setDeleteTaskDialogOpen(false);
            router.push(`/project/${projectId}`);
          }}
        />
      )}
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
