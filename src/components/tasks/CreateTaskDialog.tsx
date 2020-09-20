import { Button, Box } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { MyTextInput } from "../MyTextInput";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { DATE_FORMAT } from "../../utils/dateFormat";
import { GraphqlTask } from "../../utils/taskRenderingUtils";
import {
  useCreateTaskMutation,
  TaskSnippetFragmentDoc,
  TasksQuery,
  TasksDocument,
} from "../../generated/graphql";
import { GraphqlProject } from "../../pages/my-projects";
import { useSnackbar } from "material-ui-snackbar-provider";
import { NETWORK_ERROR } from "../../utils/texts";
import { ValueType } from "../../utils/valueType";
import { useRouter } from "next/router";
import { TASKS_PER_PAGE } from "./TaskList";

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
  const router = useRouter();

  const [createTask, { loading }] = useCreateTaskMutation();

  return (
    <div>
      <Dialog
        maxWidth={"md"}
        fullWidth={true}
        open={open}
        onClose={() => {
          onClose();
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {task
            ? `Create a subtask for task ${task.title} on project ${project.title}`
            : `Create a task on project ${project.title}`}
        </DialogTitle>
        <DialogContent>
          <Formik
            validateOnBlur={false}
            initialValues={{
              title: "",
              description: "",
              dueDate: null,
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
            onSubmit={async (values, { resetForm }) => {
              let result: null | ValueType<
                ReturnType<typeof createTask>
              > = null;

              try {
                result = await createTask({
                  variables: {
                    projectId: project.id,
                    parentTaskId: task ? task.id : null,
                    input: {
                      title: values.title,
                      description: values.description || null,
                      dueDate: values.dueDate,
                    },
                  },
                  update: (cache, { data }) => {
                    if (data && data.createTask) {
                      const queryVars = {
                        projectId: project.id,
                        parentTaskId: task ? task.id : null,
                        limit: TASKS_PER_PAGE,
                        offset: 0,
                      };

                      const tasks = cache.readQuery<TasksQuery>({
                        query: TasksDocument,
                        variables: queryVars,
                      });

                      if (!tasks) {
                        return;
                      }

                      cache.writeQuery<TasksQuery>({
                        query: TasksDocument,
                        data: {
                          __typename: "Query",
                          tasks: {
                            ...tasks.tasks,
                            tasks: [data.createTask, ...tasks.tasks.tasks],
                          },
                        },
                        variables: queryVars,
                      });
                    }
                  },
                });
              } catch (e) {
                console.log(e);
                snackbar.showMessage(NETWORK_ERROR);
                return;
              }

              if (result && result.data && result.data.createTask) {
                snackbar.showMessage(
                  `Task ${result.data.createTask.title} created!`,
                  "View",
                  () => {
                    router.push(
                      `/project/${project.id}/task/${
                        result!.data!.createTask!.id
                      }`
                    );
                  }
                );

                resetForm();
                onClose();
              }
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
                    disabled={isSubmitting || loading}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Create
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onClose();
            }}
            disabled={loading}
            color="default"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
