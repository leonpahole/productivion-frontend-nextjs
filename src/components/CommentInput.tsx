import { Box, Button, CircularProgress } from "@material-ui/core";
import { Formik } from "formik";
import { useSnackbar } from "material-ui-snackbar-provider";
import * as Yup from "yup";
import {
  useCreateCommentMutation,
  useMeQuery,
  CommentSnippetFragmentDoc,
} from "../generated/graphql";
import { NETWORK_ERROR } from "../utils/texts";
import { MyTextInput } from "./MyTextInput";

interface CommentInputProps {
  projectId: number;
  taskId?: number;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  projectId,
  taskId,
}) => {
  const snackbar = useSnackbar();

  const { data: meData, loading: meLoading, error: meError } = useMeQuery();

  const [createComment] = useCreateCommentMutation();

  if (meLoading) {
    return <CircularProgress />;
  }

  if (meError != null || meData == null || !meData.me) {
    return null;
  }

  return (
    <Box>
      <Formik
        initialValues={{
          comment: "",
        }}
        validationSchema={Yup.object({
          comment: Yup.string().required("Please enter comment!"),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createComment({
              variables: {
                projectId,
                taskId,
                input: {
                  content: values.comment,
                },
              },
              update: (cache, { data }) => {
                if (data && data.createComment) {
                  cache.modify({
                    fields: {
                      comments(existingComments = []) {
                        const newCommentRef = cache.writeFragment({
                          data: data.createComment,
                          variables: {
                            projectId,
                            taskId,
                          },
                          fragment: CommentSnippetFragmentDoc,
                          fragmentName: "CommentSnippet",
                        });
                        return [newCommentRef, ...existingComments];
                      },
                    },
                  });
                }
              },
            });

            resetForm();
          } catch (e) {
            console.log(e);
            snackbar.showMessage(NETWORK_ERROR);
            return;
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <MyTextInput
              multiline
              rows={4}
              label="Your comment"
              name="comment"
              type="comment"
            />

            <Box mt={3}>
              <Button
                type="submit"
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                color="primary"
              >
                Comment
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};
