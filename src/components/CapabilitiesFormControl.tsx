import {
  createStyles,
  FormControl,
  FormGroup,
  FormLabel,
  makeStyles,
  Theme,
} from "@material-ui/core";
import React from "react";
import { isAdmin } from "../utils/userUtils";
import { MyCheckbox } from "./MyCheckbox";
import { GraphqlUserOnProject } from "./UserManagementDialog";

interface CapabilitiesFormControlProps {
  userOnProject?: GraphqlUserOnProject;
  onChange(e: any, name: string): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      marginLeft: theme.spacing(2),
    },
  })
);

interface CapabilityDescription {
  name: string;
  description: string;
}

const capabilities: CapabilityDescription[] = [
  {
    name: "canUpdateProject",
    description: "Can update project",
  },
  {
    name: "canDeleteProject",
    description: "Can delete project",
  },
  {
    name: "canAddTask",
    description: "Can add tasks",
  },
  {
    name: "canUpdateTask",
    description: "Can update tasks",
  },
  {
    name: "canDeleteTask",
    description: "Can delete tasks",
  },
  {
    name: "canCompleteTask",
    description: "Can complete tasks",
  },
  {
    name: "canManageProjectUsers",
    description: "Can manage project users",
  },
  {
    name: "canComment",
    description: "Can comment",
  },
  {
    name: "canUpdateOtherComments",
    description: "Can update other user's comments",
  },
  {
    name: "canDeleteOtherComments",
    description: "Can delete other user's comments",
  },
  // ADD CAPABILITY
];

export const CapabilitiesFormControl: React.FC<CapabilitiesFormControlProps> = ({
  userOnProject = null,
  onChange,
}) => {
  const classes = useStyles();

  const isUserAdmin = userOnProject ? isAdmin(userOnProject.presetId) : false;

  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <FormLabel component="legend">Capabilities</FormLabel>
      <FormGroup>
        {capabilities.map((c, index) => {
          const name = `capabilities.${c.name}`;
          return (
            <MyCheckbox
              key={index}
              disabled={isUserAdmin}
              label={c.description}
              name={name}
              onChange={(e: any) => {
                onChange(e, name);
              }}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
};
