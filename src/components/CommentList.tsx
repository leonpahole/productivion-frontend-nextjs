import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useCommentsQuery, useMeQuery } from "../generated/graphql";
import { GraphqlProjectCapabilities } from "../pages/my-projects";
import { Loading } from "./shared/Loading";

interface CommentListProps {
  projectId: number;
  taskId?: number;
  capabilities: GraphqlProjectCapabilities;
}

export const CommentList: React.FC<CommentListProps> = ({
  projectId,
  taskId,
  capabilities,
}) => {
  const { data: meData, loading: meLoading, error: meError } = useMeQuery();

  const { data, loading, error } = useCommentsQuery({
    variables: { projectId, taskId },
  });

  /*
  const [commentToDelete, setCommentToDelete] = useState<GraphqlComment | null>(
    null
  );
  const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState(false);
    */

  if (loading || meLoading) {
    return <Loading />;
  }

  if (
    error != null ||
    data == null ||
    data.comments == null ||
    meError != null ||
    meData == null ||
    !meData.me
  ) {
    return null;
  }

  return (
    <>
      <List>
        {data.comments.map((comment) => {
          const canDeleteComment =
            comment.author.id === meData.me.id ||
            capabilities.canDeleteOtherComments;

          const canUpdateComment =
            comment.author.id === meData.me.id ||
            capabilities.canDeleteOtherComments;

          return (
            <ListItem key={comment.id}>
              <ListItemText
                primary={`${comment.content}`}
                primaryTypographyProps={{
                  style: {
                    whiteSpace: "pre-line",
                  },
                }}
                secondary={`${comment.createdAt}`}
              />
              <ListItemSecondaryAction>
                {canUpdateComment && (
                  <IconButton edge="end" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                )}

                {canDeleteComment && (
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      {/*capabilities.canDeleteOtherComments && (
        <DeleteCommentDialog
          open={deleteCommentDialogOpen}
          projectId={projectId}
          comment={commentToDelete}
          onClose={() => {
            setDeleteCommentDialogOpen(false);
          }}
        />
        )*/}
    </>
  );
};
