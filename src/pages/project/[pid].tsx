import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@material-ui/core";
import { NextPage } from "next";
import React, { useState } from "react";
import { CreateTaskDialog } from "../../components/CreateTaskDialog";
import { DeleteTaskDialog } from "../../components/DeleteTaskDialog";
import { TaskList } from "../../components/TaskList";
import { UserManagementDialog } from "../../components/UserManagementDialog";
import { useProjectQuery } from "../../generated/graphql";
import { GraphqlTask } from "../../utils/taskRenderingUtils";
import { useRouter } from "next/router";

const ProjectView: NextPage<{ projectId: number }> = ({ projectId }) => {
  const { data, loading, error } = useProjectQuery({
    variables: { id: projectId },
  });

  const router = useRouter();

  const [taskToDelete, setTaskToDelete] = useState<GraphqlTask | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<GraphqlTask | null>(null);

  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !data || !data.project) {
    return <div>Error</div>;
  }

  return (
    <>
      <Container component="main" maxWidth="md">
        <Typography component="h1" variant="h4">
          Project: {data.project.title}
        </Typography>
        <Typography variant="subtitle1">{data.project.description}</Typography>

        {data.project.capabilities.canManageProjectUsers && (
          <UserManagementDialog project={data.project} />
        )}

        <Typography variant="h6">Tasks</Typography>

        {data.project.capabilities.canAddTask && (
          <Box mt={3} mb={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {
                setCreateTaskDialogOpen(true);
              }}
            >
              Create task
            </Button>
          </Box>
        )}

        <Box mt={1} mb={2}>
          <TaskList
            projectId={data.project.id}
            onTaskClick={(task: GraphqlTask) => {
              router.push(`/task/${projectId}/${task.id}`);
            }}
            onTaskEdit={(task: GraphqlTask) => {
              setEditTaskDialogOpen(true);
              setTaskToEdit(task);
            }}
            onTaskDelete={(task: GraphqlTask) => {
              setDeleteTaskDialogOpen(true);
              setTaskToDelete(task);
            }}
            capabilities={data.project.capabilities}
          />
        </Box>
      </Container>
      {data.project.capabilities.canAddTask && (
        <CreateTaskDialog
          open={createTaskDialogOpen}
          project={data.project}
          onClose={() => {
            setCreateTaskDialogOpen(false);
          }}
        />
      )}
      {data.project.capabilities.canUpdateTask && (
        <CreateTaskDialog
          open={editTaskDialogOpen}
          task={taskToEdit}
          project={data.project}
          onClose={() => {
            setEditTaskDialogOpen(false);
            setTaskToEdit(null);
          }}
        />
      )}
      {data.project.capabilities.canDeleteTask && (
        <DeleteTaskDialog
          open={deleteTaskDialogOpen}
          projectId={projectId}
          task={taskToDelete}
          onClose={() => {
            setDeleteTaskDialogOpen(false);
            setTaskToDelete(null);
          }}
        />
      )}
    </>
  );
};

ProjectView.getInitialProps = ({ query }) => {
  return {
    projectId: Number(query.pid),
  };
};

export default ProjectView;
