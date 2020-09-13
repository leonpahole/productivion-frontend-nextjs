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

export interface CreateTaskDialogResult {
  title: string;
  description: string | null;
  dueDate: Date | null;
}

interface CreateTaskDialogProps {
  open: boolean;
  onClose(result: CreateTaskDialogResult | null): void;
  projectTitle: string;
  task?: GraphqlTask | null;
}

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  open,
  onClose,
  projectTitle,
  task = null,
}) => {
  const handleClose = (result: CreateTaskDialogResult | null) => {
    onClose(result);
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
          {task == null && (
            <div>
              Create a task on project <b>{projectTitle}</b>
            </div>
          )}
          {task != null && <div>Update a task {task.title}</div>}
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
              dueDate: Yup.date(),
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
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
