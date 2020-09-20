import { GraphqlProject } from "../../pages/my-projects";
import { ProjectListItem } from "./ProjectListItem";
import { useState } from "react";
import { ConfirmDeleteProjectDialog } from "./ConfirmDeleteProjectDialog";
import { UpdateProjectDialog } from "./UpdateProjectDialog";

interface ProjectListProps {
  projects: GraphqlProject[];
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const [projectToDelete, setProjectToDelete] = useState<GraphqlProject | null>(
    null
  );
  const [projectToUpdate, setProjectToUpdate] = useState<GraphqlProject | null>(
    null
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const toggleDeleteDialog = (project: GraphqlProject | null = null) => {
    setDeleteDialogOpen(project != null);
    setProjectToDelete(project);
  };

  const toggleUpdateDialog = (project: GraphqlProject | null = null) => {
    setUpdateDialogOpen(project != null);
    setProjectToUpdate(project);
  };

  return (
    <>
      {projects.map((p) => (
        <ProjectListItem
          project={p}
          onUpdate={() => toggleUpdateDialog(p)}
          onDelete={() => toggleDeleteDialog(p)}
        />
      ))}

      <ConfirmDeleteProjectDialog
        open={deleteDialogOpen}
        project={projectToDelete}
        onClose={() => toggleDeleteDialog()}
      />

      <UpdateProjectDialog
        open={updateDialogOpen}
        project={projectToUpdate}
        onClose={() => toggleUpdateDialog()}
      />
    </>
  );
};
