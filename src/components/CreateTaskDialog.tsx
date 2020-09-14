import { Button, Box } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { MyTextInput } from "./MyTextInput";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { DATE_FORMAT } from "../utils/dateFormat";
import { GraphqlTask } from "../utils/taskRenderingUtils";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  TaskSnippetFragmentDoc,
} from "../generated/graphql";
import { GraphqlProject } from "../pages/my-projects";
import { useSnackbar } from "material-ui-snackbar-provider";
import { NETWORK_ERROR } from "../utils/texts";

export interface CreateTaskDialogResult {
  title: string;
  description: string | null;
  dueDate: Date | null;
}

interface CreateTaskDialogProps {
  open: boolean;
  onClose(): void;
  project: GraphqlProject;
  task?: GraphqlTask | null;
}

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  open,
  onClose,
  project,
  task = null,
}) => {
  const snackbar = useSnackbar();

  const [createTask, { loading: createLoading }] = useCreateTaskMutation();
  const [updateTask, { loading: updateLoading }] = useUpdateTaskMutation();

  const loading = createLoading || updateLoading;
  const isEdit = task != null;

  const handleClose = async (result: CreateTaskDialogResult | null) => {
    if (result) {
      if (isEdit) {
        await onUpdateTask(result);
      } else {
        await onCreateTask(result);
      }

      onClose();
    } else {
      onClose();
    }
  };

  const onUpdateTask = async (result: CreateTaskDialogResult) => {
    if (!task) {
      return;
    }

    try {
      const updateResult = await updateTask({
        variables: {
          id: task.id,
          projectId: project.id,
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
  };

  const onCreateTask = async (result: CreateTaskDialogResult) => {
    try {
      const createTaskResult = await createTask({
        variables: {
          projectId: project.id,
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
                      projectId: project.id,
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
  };

  return (
    <div>
      <Dialog
        maxWidth={"md"}
        fullWidth={true}
        open={open}
        onClose={() => {
          handleClose(null);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {isEdit ? (
            <div>Update a task {task!.title}</div>
          ) : (
            <div>
              Create a task on project <b>{project.title}</b>
            </div>
          )}
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              title: task ? task.title : "",
              description: task ? task.description || "" : "",
              dueDate: task && task.dueDate ? new Date(task.dueDate) : null,
            }}
            validationSchema={Yup.object({
              title: Yup.string()
                .min(4, "Title should be at least 4 letters long!")
                .max(250, "Title shouldn't be longer than 250 letters!")
                .required("Please enter task title!"),
              description: Yup.string()
                .min(4, "Description should be at least 4 letters long!")
                .max(250, "Description shouldn't be longer than 250 letters!"),
              dueDate: Yup.date().nullable(),
            })}
            onSubmit={async (values) => {
              handleClose(values);
            }}
          >
            {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <MyTextInput label="Task title" name="title" type="title" />

                <MyTextInput
                  label="Task description (optional)"
                  name="description"
                  type="description"
                />

                <KeyboardDatePicker
                  autoOk
                  inputVariant="outlined"
                  margin="normal"
                  fullWidth
                  label="Due date (optional)"
                  format={DATE_FORMAT}
                  value={values.dueDate}
                  InputAdornmentProps={{ position: "end" }}
                  onChange={(date) => setFieldValue("dueDate", date)}
                />

                <Box mt={3}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    {task ? "Update" : "Create"}
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(null);
            }}
            disabled={loading}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
