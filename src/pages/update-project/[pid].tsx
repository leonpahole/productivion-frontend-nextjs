import {
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Typography,
} from "@material-ui/core";
import { Formik } from "formik";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";
import { MyTextInput } from "../../components/MyTextInput";
import {
  useProjectQuery,
  useUpdateProjectMutation,
} from "../../generated/graphql";
import { NETWORK_ERROR } from "../../utils/texts";
import { useFormStyles } from "../../utils/useFormStyles";
import { ValueType } from "../../utils/valueType";

interface EditProjectProps {}

const EditProject: React.FC<EditProjectProps> = ({}) => {
  const router = useRouter();
  const { pid } = router.query;

  if (!pid) {
    return <div>Not found</div>;
  }

  const { data, loading, error } = useProjectQuery({
    variables: { id: parseInt(pid as string) },
  });

  const [updateProject] = useUpdateProjectMutation();
  const classes = useFormStyles();
  const snackbar = useSnackbar();

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !data || !data.project) {
    return <div>Error</div>;
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Update project: {data.project.title}
          </Typography>

          <Formik
            initialValues={{
              title: data.project.title,
              description: data.project.description,
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
            onSubmit={async (values) => {
              let result: null | ValueType<
                ReturnType<typeof updateProject>
              > = null;

              try {
                result = await updateProject({
                  variables: {
                    id: data.project!.id,
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
                  "Go back",
                  () => {
                    router.push("/my-projects");
                  }
                );
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
                  Update
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </Container>
    </>
  );
};

export default EditProject;
