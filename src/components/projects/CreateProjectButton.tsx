import { Button, Fab, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React, { useState } from "react";
import { CreateProjectDialog } from "./CreateProjectDialog";

type ButtonVariant = "fab" | "button";

interface CreateProjectButtonProps {
  variant: ButtonVariant;
}

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export const CreateProjectButton: React.FC<CreateProjectButtonProps> = ({
  variant,
}) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const styles = useStyles();

  let button = null;

  if (variant === "fab") {
    button = (
      <Fab
        className={styles.fab}
        color="secondary"
        onClick={() => setCreateDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
    );
  } else if (variant === "button") {
    button = (
      <Button
        color={"primary"}
        variant={"contained"}
        onClick={() => setCreateDialogOpen(true)}
      >
        Create a project
      </Button>
    );
  }

  return (
    <>
      {button}
      <CreateProjectDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </>
  );
};
