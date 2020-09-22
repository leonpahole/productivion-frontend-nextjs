import { Box, Fab, List, Tooltip, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useState } from "react";
import { useCommentsQuery, useMeQuery } from "../../generated/graphql";
import { GraphqlProjectCapabilities } from "../../pages/my-projects";
import { GraphqlComment } from "../../utils/taskRenderingUtils";
import { DeleteCommentDialog } from "../DeleteCommentDialog";
import { Loading } from "../shared/Loading";
import { CommentListItem } from "./CommentListItem";

interface CommentListProps {
  projectId: number;
  taskId?: number;
  capabilities: GraphqlProjectCapabilities;
}

export const COMMENTS_PER_PAGE = 10;

export const CommentList: React.FC<CommentListProps> = ({
  projectId,
  taskId = null,
  capabilities,
}) => {
  const { data: meData, error: meError } = useMeQuery();

  const { data, loading, error, fetchMore } = useCommentsQuery({
    variables: { projectId, taskId, offset: 0, limit: COMMENTS_PER_PAGE },
    notifyOnNetworkStatusChange: true,
  });

  const [commentToDelete, setCommentToDelete] = useState<GraphqlComment | null>(
    null
  );

  if (
    error ||
    !data ||
    !data.comments ||
    !data.comments.comments ||
    meError ||
    !meData ||
    !meData.me
  ) {
    if (loading) {
      return <Loading />;
    } else {
      return null;
    }
  }

  const loadMoreComments = () => {
    fetchMore({
      variables: {
        offset: data.comments.comments.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          __typename: "Query",
          comments: {
            comments: [
              ...prev.comments.comments,
              ...fetchMoreResult.comments.comments,
            ],
            hasMore: fetchMoreResult.comments.hasMore,
          },
        };
      },
    });
  };

  const comments = data.comments.comments;
  const noComments = comments.length === 0;

  return (
    <>
      {noComments && (
        <Box mt={2}>
          <Typography variant="subtitle1" color="textSecondary" align="center">
            No comments yet. You can start the discussion by typing a comment.
          </Typography>
        </Box>
      )}

      {!noComments && (
        <List>
          {data.comments.comments.map((comment) => {
            return (
              <CommentListItem
                key={comment.id}
                comment={comment}
                capabilities={capabilities}
                userId={meData.me.id}
                onDelete={() => setCommentToDelete(comment)}
              />
            );
          })}
        </List>
      )}

      {data.comments.hasMore && (
        <Box display="flex" justifyContent="center" mt={3} mb={3}>
          {loading ? (
            <Loading />
          ) : (
            <Tooltip title="Load more" placement="top">
              <Fab
                color="primary"
                disabled={loading}
                onClick={() => {
                  loadMoreComments();
                }}
              >
                <ExpandMoreIcon />
              </Fab>
            </Tooltip>
          )}
        </Box>
      )}

      <DeleteCommentDialog
        open={commentToDelete != null}
        comment={commentToDelete}
        onClose={() => setCommentToDelete(null)}
        projectId={projectId}
      />
    </>
  );
};
