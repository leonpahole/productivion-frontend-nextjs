import { Button, Container, CssBaseline, Typography } from "@material-ui/core";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { MyTextInput } from "../components/MyTextInput";
import {
  useCreateProjectMutation,
  ProjectSnippetFragmentDoc,
} from "../generated/graphql";
import { useFormStyles } from "../utils/useFormStyles";
import { useSnackbar } from "material-ui-snackbar-provider";
import { ValueType } from "../utils/valueType";
import { NETWORK_ERROR } from "../utils/texts";
import { useRouter } from "next/router";

interface CreateProjectProps {}

const CreateProject: React.FC<CreateProjectProps> = ({}) => {
  const [createProject] = useCreateProjectMutation();
  const classes = useFormStyles();
  const snackbar = useSnackbar();
  const router = useRouter();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Create a project
        </Typography>

        <Formik
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
                  router.push("/project");
                }
              );

              resetForm();
            } else if (result.errors && result.errors.length > 0) {
              // const error = (result.errors[0] as unknown) as AppError;
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form className={classes.form} onSubmit={handleSubmit}>
              <MyTextInput label="Project title" name="title" type="title" />

              <MyTextInput
                label="Project description (optional)"
                name="description"
                type="description"
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Create
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default CreateProject;
