import { Box, Button } from "@material-ui/core";
import { Formik } from "formik";
import { useSnackbar } from "material-ui-snackbar-provider";
import * as Yup from "yup";
import {
  CommentsDocument,
  CommentsQuery,
  useCreateCommentMutation,
  useMeQuery,
} from "../../generated/graphql";
import { NETWORK_ERROR } from "../../utils/texts";
import { MyTextInput } from "../MyTextInput";
import { Loading } from "../shared/Loading";
import { COMMENTS_PER_PAGE } from "./CommentList";

interface CommentInputProps {
  projectId: number;
  taskId?: number;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  projectId,
  taskId = null,
}) => {
  const snackbar = useSnackbar();

  const { data: meData, loading: meLoading, error: meError } = useMeQuery();

  const [createComment] = useCreateCommentMutation();

  if (meLoading) {
    return <Loading />;
  }

  if (meError != null || meData == null || !meData.me) {
    return null;
  }

  return (
    <Box>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
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
                  const queryVars = {
                    projectId: projectId,
                    taskId: taskId ? taskId : null,
                    limit: COMMENTS_PER_PAGE,
                    offset: 0,
                  };

                  console.log(queryVars);

                  const comments = cache.readQuery<CommentsQuery>({
                    query: CommentsDocument,
                    variables: queryVars,
                  });

                  if (!comments) {
                    return;
                  }

                  cache.writeQuery<CommentsQuery>({
                    query: CommentsDocument,
                    data: {
                      __typename: "Query",
                      comments: {
                        ...comments.comments,
                        comments: [
                          data.createComment,
                          ...comments.comments.comments,
                        ],
                      },
                    },
                    variables: queryVars,
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
              label="Write your comment here"
              name="comment"
              type="comment"
            />

            <Box mt={1} mb={3}>
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
