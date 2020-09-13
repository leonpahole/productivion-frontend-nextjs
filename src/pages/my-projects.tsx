import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";
import React, { useState } from "react";
import {
  useMyProjectsQuery,
  useDeleteProjectMutation,
  MyProjectsQuery,
  Project,
} from "../generated/graphql";
import { ConfirmDeleteProjectDialog } from "../components/ConfirmDeleteProjectDialog";
import { NETWORK_ERROR } from "../utils/texts";
import { ButtonLink } from "../components/ButtonLink";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    width: "100%",
    margin: theme.spacing(2),
  },
}));

export type GraphqlProject = MyProjectsQuery["myProjects"][0];
export type GraphqlProjectCapabilities = MyProjectsQuery["myProjects"][0]["capabilities"];

const MyProjects: React.FC<{}> = ({}) => {
  const { data, loading, error } = useMyProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();

  const classes = useStyles();
  const snackbar = useSnackbar();

  const [toDeleteProject, setToDeleteProject] = useState<GraphqlProject | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const openDeleteDialog = (project: GraphqlProject) => {
    setDeleteDialogOpen(true);
    setToDeleteProject(project);
  };

  const onDeleteDialogClose = async (confirmed: boolean) => {
    setDeleteDialogOpen(false);

    if (confirmed && toDeleteProject != null) {
      try {
        await deleteProject({
          variables: { id: toDeleteProject.id },
          update: (cache, { data }) => {
            if (data?.deleteProject) {
              cache.modify({
                fields: {
                  myProjects(
                    existingProjectRefs: Project[] = [],
                    { readField }
                  ) {
                    return existingProjectRefs.filter((projectRef) => {
                      return toDeleteProject.id !== readField("id", projectRef);
                    });
                  },
                },
              });
            }
          },
        });

        snackbar.showMessage("Project deleted!");
      } catch (e) {
        console.log(e);
        snackbar.showMessage(NETWORK_ERROR);
      }

      setToDeleteProject(null);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !data?.myProjects) {
    return <p>Error</p>;
  }

  if (data.myProjects.length === 0) {
    return <p>No projects</p>;
  }

  return (
    <>
      <Container className={classes.root} component="main" maxWidth="md">
        <Typography component="h1" variant="h5">
          My projects
        </Typography>
        {data.myProjects.map((p) => (
          <Card className={classes.card} key={p.id} variant="outlined">
            <CardContent>
              <Typography variant="h5" component="h2">
                {p.title}
              </Typography>
              <Typography color="textSecondary">{p.description}</Typography>
            </CardContent>
            <CardActions>
              <Button
                component={ButtonLink}
                href="/project/[pid]"
                as={`/project/${p.id}`}
                color="inherit"
              >
                Details
              </Button>

              {p.capabilities.canUpdateProject && (
                <Button
                  component={ButtonLink}
                  href="/update-project/[pid]"
                  as={`/update-project/${p.id}`}
                  color="inherit"
                >
                  Edit
                </Button>
              )}

              {p.capabilities.canDeleteProject && (
                <Button
                  onClick={() => {
                    openDeleteDialog(p);
                  }}
                  size="small"
                >
                  Delete
                </Button>
              )}
            </CardActions>
          </Card>
        ))}
      </Container>
      <ConfirmDeleteProjectDialog
        open={deleteDialogOpen}
        projectTitle={toDeleteProject ? toDeleteProject.title : ""}
        onClose={onDeleteDialogClose}
      />
    </>
  );
};

export default MyProjects;
