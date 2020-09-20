import {
  Box,
  CircularProgress,
  Container,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ProjectList } from "../components/projects/ProjectList";
import { MyProjectsQuery, useMyProjectsQuery } from "../generated/graphql";
import { CreateProjectButton } from "../components/projects/CreateProjectButton";

const useStyles = makeStyles((theme) => ({
  heading: {
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.typography.h3.fontSize,
    },
  },
  image: {
    width: "100%",
    height: "auto",
    maxWidth: 400,
  },
}));

export type GraphqlProject = MyProjectsQuery["myProjects"][0];
export type GraphqlProjectCapabilities = MyProjectsQuery["myProjects"][0]["capabilities"];

const MyProjects: React.FC<{}> = ({}) => {
  const { data, loading, error } = useMyProjectsQuery();

  const styles = useStyles();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data?.myProjects || data.myProjects.length === 0) {
    return (
      <>
        <Container component="main" maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            className={styles.heading}
          >
            No projects yet
          </Typography>
          <Box mt={3} mb={4} display="flex" justifyContent="center">
            <img className={styles.image} src="/todo-no-projects.png" />
          </Box>
          <Box>
            <Typography component="h2" variant="subtitle1" align="center">
              Projects help you organize your tasks into units. Each projects
              can hold multiple collaborators.
            </Typography>
          </Box>
          <Box mt={2} display="flex" justifyContent="center">
            <CreateProjectButton variant="button" />
          </Box>
        </Container>
        <CreateProjectButton variant="fab" />
      </>
    );
  }

  return (
    <>
      <Container component="main" maxWidth="md">
        <Box mb={3}>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            className={styles.heading}
          >
            Your projects
          </Typography>
        </Box>

        <ProjectList projects={data.myProjects} />
      </Container>
      <CreateProjectButton variant="fab" />
    </>
  );
};

export default MyProjects;
