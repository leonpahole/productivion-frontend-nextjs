import { Box, Button, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik } from "formik";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";
import { useUpdateProjectMutation } from "../../generated/graphql";
import { GraphqlProject } from "../../pages/my-projects";
import { NETWORK_ERROR } from "../../utils/texts";
import { useFormStyles } from "../../utils/useFormStyles";
import { ValueType } from "../../utils/valueType";
import { MyTextInput } from "../MyTextInput";

interface CreateProjectDialogProps {
  open: boolean;
  onClose(): void;
  project: GraphqlProject | null;
}

export const UpdateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  open,
  onClose,
  project,
}) => {
  const snackbar = useSnackbar();
  const router = useRouter();
  const formStyles = useFormStyles();

  const [updateProject, { loading }] = useUpdateProjectMutation();

  const closeDialog = async () => {
    onClose();
  };

  if (!project) {
    return null;
  }

  return (
    <Dialog
      maxWidth="sm"
      fullWidth={true}
      open={open}
      onClose={() => {
        closeDialog();
      }}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Box mt={2}>
          <Typography variant="h4" align="center">
            Update project {project.title}
          </Typography>
          <Typography variant="subtitle1" align="center">
            Update the name or description.
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Formik
          validateOnBlur={false}
          initialValues={{
            title: project.title,
            description: project.description,
          }}
          validationSchema={Yup.object({
            title: Yup.string()
              .min(4, "Title should be at least 4 letters long!")
              .max(250, "Title shouldn't be longer than 250 letters!")
              .required("Please enter project title!"),
            description: Yup.string()
              .min(4, "Description should be at least 4 letters long!")
              .max(250, "Description shouldn't be longer than 250 letters!"),
          })}
          onSubmit={async (values, { resetForm }) => {
            let result: null | ValueType<
              ReturnType<typeof updateProject>
            > = null;

            try {
              result = await updateProject({
                variables: {
                  id: project.id,
                  input: {
                    title: values.title,
                    description: values.description || null,
                  },
                },
              });
            } catch (e) {
              console.log(e);
              snackbar.showMessage(NETWORK_ERROR);
              return;
            }

            if (result.data?.updateProject) {
              snackbar.showMessage(
                `Project ${result.data.updateProject.title} updated!`,
                "View",
                () => {
                  router.push(`/project/${result!.data!.updateProject?.id}`);
                }
              );

              resetForm();
              closeDialog();
            } else if (result.errors && result.errors.length > 0) {
              // const error = (result.errors[0] as unknown) as AppError;
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form className={formStyles.form} onSubmit={handleSubmit}>
              <MyTextInput label="Project title" name="title" type="title" />

              <MyTextInput
                label="Project description (optional)"
                name="description"
                type="description"
              />

              <Button
                type="submit"
                disabled={isSubmitting || loading}
                fullWidth
                variant="contained"
                color="primary"
                className={formStyles.submit}
              >
                Update
              </Button>
            </form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closeDialog();
          }}
          disabled={loading}
          color="default"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
