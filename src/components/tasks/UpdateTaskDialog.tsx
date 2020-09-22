import { Box, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Formik } from "formik";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";
import { useUpdateTaskMutation } from "../../generated/graphql";
import { GraphqlProject } from "../../pages/my-projects";
import { DATE_FORMAT } from "../../utils/dateFormat";
import { GraphqlTask } from "../../utils/taskRenderingUtils";
import { NETWORK_ERROR } from "../../utils/texts";
import { ValueType } from "../../utils/valueType";
import { MyTextInput } from "../MyTextInput";
import { useCommonStyles } from "../../utils/useCommonStyles";

interface UpdateTaskDialogProps {
  open: boolean;
  onClose(): void;
  project: GraphqlProject;
  task?: GraphqlTask | null;
}

export const UpdateTaskDialog: React.FC<UpdateTaskDialogProps> = ({
  open,
  onClose,
  project,
  task = null,
}) => {
  const snackbar = useSnackbar();
  const router = useRouter();

  const commontStyles = useCommonStyles();

  const [updateTask, { loading: updateLoading }] = useUpdateTaskMutation();

  const loading = updateLoading;

  if (!task) {
    return null;
  }

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
          <div className={commontStyles.wordWrap}>Update task {task.title}</div>
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              title: task.title,
              description: task.description || "",
              dueDate: task.dueDate ? new Date(task.dueDate) : null,
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
                ReturnType<typeof updateTask>
              > = null;

              try {
                result = await updateTask({
                  variables: {
                    id: task.id,
                    projectId: project.id,
                    input: {
                      title: values.title,
                      description: values.description || null,
                      dueDate: values.dueDate,
                    },
                  },
                });
              } catch (e) {
                console.log(e);
                snackbar.showMessage(NETWORK_ERROR);
                return;
              }

              if (result && result.data && result.data.updateTask) {
                snackbar.showMessage(
                  `Task ${result.data.updateTask.title} updated!`,
                  "View",
                  () => {
                    router.push(
                      `/project/${project.id}/task/${
                        result!.data!.updateTask!.id
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
                    disabled={isSubmitting}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Update
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
