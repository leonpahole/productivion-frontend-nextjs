import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";
import { NextPage } from "next";
import React, { useState } from "react";
import { DeleteTaskDialog } from "../../components/DeleteTaskDialog";
import {
  CreateTaskDialog,
  CreateTaskDialogResult,
} from "../../components/CreateTaskDialog";
import { TaskList } from "../../components/TaskList";
import {
  TaskSnippetFragmentDoc,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useProjectQuery,
  useUpdateTaskMutation,
  Task,
} from "../../generated/graphql";
import { GraphqlTask } from "../../utils/taskRenderingUtils";
import { NETWORK_ERROR } from "../../utils/texts";
import { useGlobalStyles } from "../../utils/useGlobalStyles";
import { UserManagementDialog } from "../../components/UserManagementDialog";

const ProjectView: NextPage<{ projectId: number }> = ({ projectId }) => {
  const { data, loading, error } = useProjectQuery({
    variables: { id: projectId },
  });

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [taskToDelete, setTaskToDelete] = useState<GraphqlTask | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<GraphqlTask | null>(null);

  const snackbar = useSnackbar();
  const classes = useGlobalStyles();

  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);

  const openCreateTaskDialog = () => {
    setCreateTaskDialogOpen(true);
  };

  const onCreateTaskDialogClose = async (result: CreateTaskDialogResult) => {
    setCreateTaskDialogOpen(false);

    if (result) {
      try {
        const createTaskResult = await createTask({
          variables: {
            projectId,
            parentTaskId: null,
            input: {
              title: result.title,
              description: result.description || null,
              dueDate: result.dueDate,
            },
          },
          update: (cache, { data }) => {
            if (data && data.createTask) {
              cache.modify({
                fields: {
                  tasks(existingTasks = []) {
                    const newTaskRef = cache.writeFragment({
                      data: data.createTask,
                      variables: {
                        projectId,
                        parentTaskId: null,
                      },
                      fragment: TaskSnippetFragmentDoc,
                      fragmentName: "TaskSnippet",
                    });
                    return [newTaskRef, ...existingTasks];
                  },
                },
              });
            }
          },
        });

        if (
          !createTaskResult ||
          createTaskResult.errors ||
          !createTaskResult.data ||
          !createTaskResult.data.createTask
        ) {
          return;
        }

        snackbar.showMessage(
          `Task ${createTaskResult.data.createTask.title} created!`
        );
      } catch (e) {
        console.log(e);
        snackbar.showMessage(NETWORK_ERROR);
      }
    }
  };

  const onTaskDelete = (task: GraphqlTask) => {
    setDeleteTaskDialogOpen(true);
    setTaskToDelete(task);
  };

  const onDeleteTaskDialogClose = async (confirmed: boolean) => {
    if (confirmed && taskToDelete) {
      try {
        await deleteTask({
          variables: { id: taskToDelete.id, projectId },
          update: (cache, { data }) => {
            if (data?.deleteTask) {
              cache.modify({
                fields: {
                  tasks(existingTaskRefs: Task[] = [], { readField }) {
                    return existingTaskRefs.filter((taskRef) => {
                      return taskToDelete.id !== readField("id", taskRef);
                    });
                  },
                },
              });
            }
          },
        });
        snackbar.showMessage(`Task ${taskToDelete.title} deleted!`);
      } catch (e) {
        snackbar.showMessage(NETWORK_ERROR);
      }
    }

    setDeleteTaskDialogOpen(false);
    setTaskToDelete(null);
  };

  const openEditTaskDialog = (task: GraphqlTask) => {
    setTaskToEdit(task);
    setEditTaskDialogOpen(true);
  };

  const onTaskEditDialogClose = async (result: CreateTaskDialogResult) => {
    if (result && taskToEdit) {
      try {
        const updateResult = await updateTask({
          variables: {
            id: taskToEdit.id,
            projectId,
            input: {
              title: result.title,
              description: result.description || null,
              dueDate: result.dueDate,
            },
          },
        });

        if (result && updateResult.data?.updateTask) {
          snackbar.showMessage(
            `Task ${updateResult.data.updateTask.title} updated!`
          );
        }
      } catch (e) {
        snackbar.showMessage(NETWORK_ERROR);
      }
    }

    setEditTaskDialogOpen(false);
    setTaskToEdit(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !data || !data.project) {
    return <div>Error</div>;
  }

  return (
    <>
      <Container className={classes.container} component="main" maxWidth="md">
        <CssBaseline />

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
              onClick={openCreateTaskDialog}
            >
              Create task
            </Button>
          </Box>
        )}

        <Box mt={1} mb={2}>
          <TaskList
            projectId={data.project.id}
            onTaskEdit={openEditTaskDialog}
            onTaskDelete={onTaskDelete}
            capabilities={data.project.capabilities}
          />
        </Box>
      </Container>
      {data.project.capabilities.canAddTask && (
        <CreateTaskDialog
          open={createTaskDialogOpen}
          projectTitle={data.project.title}
          onClose={onCreateTaskDialogClose}
        />
      )}
      {data.project.capabilities.canUpdateTask && (
        <CreateTaskDialog
          task={taskToEdit}
          open={editTaskDialogOpen}
          projectTitle={data.project.title}
          onClose={onTaskEditDialogClose}
        />
      )}
      {data.project.capabilities.canDeleteTask && (
        <DeleteTaskDialog
          open={deleteTaskDialogOpen}
          onClose={onDeleteTaskDialogClose}
          task={taskToDelete}
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
