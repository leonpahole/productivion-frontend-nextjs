import { List, Box, Tooltip, Fab, Divider } from "@material-ui/core";
import { useState } from "react";
import { useTasksQuery } from "../../generated/graphql";
import { GraphqlProject } from "../../pages/my-projects";
import { GraphqlTask } from "../../utils/taskRenderingUtils";
import { Loading } from "../shared/Loading";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { TaskListItem } from "./TaskListItem";
import { UpdateTaskDialog } from "./UpdateTaskDialog";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

interface TaskListProps {
  project: GraphqlProject;
  parentTask?: GraphqlTask | null;
}

export const TASKS_PER_PAGE = 10;

export const TaskList: React.FC<TaskListProps> = ({
  project,
  parentTask = null,
}) => {
  const { data, loading, error, fetchMore } = useTasksQuery({
    variables: {
      projectId: project.id,
      parentTaskId: parentTask ? parentTask.id : null,
      limit: TASKS_PER_PAGE,
      offset: 0,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [taskToDelete, setTaskToDelete] = useState<GraphqlTask | null>(null);
  const [taskToUpdate, setTaskToUpdate] = useState<GraphqlTask | null>(null);

  const [updateTaskDialogOpen, setUpdateTaskDialogOpen] = useState(false);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);

  if (error || !data || !data.tasks || !data.tasks.tasks) {
    if (loading) {
      return <Loading />;
    } else {
      return null;
    }
  }

  const loadMoreTasks = () => {
    fetchMore({
      variables: {
        offset: data.tasks.tasks.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          __typename: "Query",
          tasks: {
            tasks: [...prev.tasks.tasks, ...fetchMoreResult.tasks.tasks],
            hasMore: fetchMoreResult.tasks.hasMore,
          },
        };
      },
    });
  };

  return (
    <>
      <List
        style={{
          width: "100%",
        }}
      >
        {data.tasks.tasks.map((task) => {
          return (
            <>
              <TaskListItem
                key={task.id}
                projectId={project.id}
                task={task}
                capabilities={project.capabilities}
                onEdit={() => {
                  setUpdateTaskDialogOpen(true);
                  setTaskToUpdate(task);
                }}
                onDelete={() => {
                  setDeleteTaskDialogOpen(true);
                  setTaskToDelete(task);
                }}
              />
              <Divider />
            </>
          );
        })}
      </List>

      {data.tasks.hasMore && (
        <Box display="flex" justifyContent="center" mt={3} mb={3}>
          {loading ? (
            <Loading />
          ) : (
            <Tooltip title="Load more" placement="top">
              <Fab
                color="primary"
                disabled={loading}
                onClick={() => {
                  loadMoreTasks();
                }}
              >
                <ExpandMoreIcon />
              </Fab>
            </Tooltip>
          )}
        </Box>
      )}

      {project.capabilities.canUpdateTask && (
        <UpdateTaskDialog
          open={updateTaskDialogOpen}
          task={taskToUpdate}
          project={project}
          onClose={() => {
            setUpdateTaskDialogOpen(false);
            setTaskToUpdate(null);
          }}
        />
      )}

      {project.capabilities.canDeleteTask && (
        <DeleteTaskDialog
          open={deleteTaskDialogOpen}
          projectId={project.id}
          task={taskToDelete}
          onClose={() => {
            setDeleteTaskDialogOpen(false);
            setTaskToDelete(null);
          }}
        />
      )}
    </>
  );
};
