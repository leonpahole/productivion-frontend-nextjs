import { Box, Container } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";
import { NotFound } from "../../../components/NotFound";
import { ProjectDisplay } from "../../../components/projects/ProjectDisplay";
import { Loading } from "../../../components/shared/Loading";
import { TaskList } from "../../../components/tasks/TaskList";
import { useProjectQuery } from "../../../generated/graphql";

const ProjectView: NextPage<{ projectId: number }> = ({ projectId }) => {
  const { data, loading, error } = useProjectQuery({
    variables: { id: projectId },
  });

  if (loading) {
    return <Loading />;
  }

  if (error || !data || !data.project) {
    return <NotFound />;
  }

  return (
    <>
      <Container component="main" maxWidth="md">
        <ProjectDisplay project={data.project} />

        <Box mt={1} mb={2}>
          <TaskList project={data.project} />
        </Box>

        {/* 
        <Box mt={1} mb={2}>
          <Typography variant="h6">Comments</Typography>
          <CommentInput projectId={data.project.id} />
          <CommentList
            projectId={data.project.id}
            capabilities={data.project.capabilities}
          />
        </Box> */}
      </Container>
    </>
  );
};

ProjectView.getInitialProps = ({ query }) => {
  return {
    projectId: Number(query.pid),
  };
};

export default ProjectView;
