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
import {
  ProjectSnippetFragmentDoc,
  useCreateProjectMutation,
} from "../../generated/graphql";
import { NETWORK_ERROR } from "../../utils/texts";
import { useFormStyles } from "../../utils/useFormStyles";
import { ValueType } from "../../utils/valueType";
import { MyTextInput } from "../MyTextInput";

interface CreateProjectDialogProps {
  open: boolean;
  onClose(): void;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  open,
  onClose,
}) => {
  const snackbar = useSnackbar();
  const router = useRouter();
  const formStyles = useFormStyles();

  const [createProject, { loading }] = useCreateProjectMutation();

  const closeDialog = async () => {
    onClose();
  };

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
            Create a project
          </Typography>
          <Typography variant="subtitle1" align="center">
            Give it a descriptive name and an optional description.
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Formik
          validateOnBlur={false}
          initialValues={{
            title: "",
            description: "",
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
              ReturnType<typeof createProject>
            > = null;

            try {
              result = await createProject({
                variables: {
                  input: {
                    title: values.title,
                    description: values.description || null,
                  },
                },
                update: (cache, { data }) => {
                  cache.modify({
                    fields: {
                      myProjects(existingProjects = []) {
                        const newProjectRef = cache.writeFragment({
                          data: data?.createProject,
                          fragment: ProjectSnippetFragmentDoc,
                          fragmentName: "ProjectSnippet",
                        });
                        return [newProjectRef, ...existingProjects];
                      },
                    },
                  });
                },
              });
            } catch (e) {
              console.log(e);
              snackbar.showMessage(NETWORK_ERROR);
              return;
            }

            if (result.data?.createProject) {
              snackbar.showMessage(
                `Project ${result.data.createProject.title} created!`,
                "View",
                () => {
                  router.push(`/project/${result!.data!.createProject?.id}`);
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
                Create
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
          color="secondary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
