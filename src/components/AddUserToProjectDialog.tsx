import { Box, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { MySelect } from "./MySelect";
import { MyTextInput } from "./MyTextInput";
import { CapabilitiesFormControl } from "./CapabilitiesFormControl";
import {
  rolesOptions,
  UserCapabilities,
  RolePresets,
} from "../utils/userUtils";
import { GraphqlUserOnProject } from "./UserManagementDialog";

export interface AddUserToProjectDialogResult {
  email: string;
  rolePresetId: number;
  capabilities: UserCapabilities;
  isEdit: boolean;
}

interface AddUserToProjectDialogProps {
  open: boolean;
  onClose(result: AddUserToProjectDialogResult | null, e?: any): void;
  projectTitle: string;
  userOnProject?: GraphqlUserOnProject | null;
}

export const AddUserToProjectDialog: React.FC<AddUserToProjectDialogProps> = ({
  open,
  onClose,
  projectTitle,
  userOnProject = null,
}) => {
  const isEdit = userOnProject != null;

  const handleClose = (
    result: AddUserToProjectDialogResult | null,
    setErrors?: any
  ) => {
    onClose(result, setErrors);
  };

  const roleSelectChanged = (e: any, setFieldValue: any) => {
    const roleId = e.target.value;
    setFieldValue("rolePresetId", roleId);
    const rolePreset = RolePresets[roleId];
    if (!rolePreset) {
      return;
    }

    Object.entries(rolePreset.capabilities).forEach(([key, value]) => {
      setFieldValue(`capabilities.${key}`, value);
    });
  };

  const capabilityCheckboxChanged = (
    e: any,
    name: string,
    setFieldValue: any
  ) => {
    setFieldValue(name, e.target.checked);
    setFieldValue(`rolePresetId`, 0);
  };

  return (
    <div>
      <Dialog
        maxWidth={"md"}
        fullWidth={true}
        open={open}
        onClose={() => {
          handleClose(null);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <div>
            Add a user on project <b>{projectTitle}</b>
          </div>
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              email: userOnProject ? userOnProject.user.email : "",
              rolePresetId: userOnProject ? userOnProject.presetId || 0 : 0,
              capabilities: {
                canUpdateProject: userOnProject
                  ? userOnProject.canUpdateProject
                  : false,
                canDeleteProject: userOnProject
                  ? userOnProject.canDeleteProject
                  : false,
                canAddTask: userOnProject ? userOnProject.canAddTask : false,
                canUpdateTask: userOnProject
                  ? userOnProject.canUpdateTask
                  : false,
                canDeleteTask: userOnProject
                  ? userOnProject.canDeleteTask
                  : false,
                canCompleteTask: userOnProject
                  ? userOnProject.canCompleteTask
                  : false,
                canManageProjectUsers: userOnProject
                  ? userOnProject.canManageProjectUsers
                  : false,
              },
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email address!")
                .max(250, "Email shouldn't be longer than 250 letters!")
                .required("Please enter your email address!"),
            })}
            onSubmit={async (values, { setErrors }) => {
              handleClose({ ...values, isEdit }, setErrors);
            }}
          >
            {({ handleSubmit, isSubmitting, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <MyTextInput
                  disabled={isEdit}
                  label="Email"
                  name="email"
                  type="email"
                />

                <MySelect
                  label="Role"
                  name="rolePresetId"
                  showNone={false}
                  options={rolesOptions}
                  onChange={(e: any) => roleSelectChanged(e, setFieldValue)}
                />

                <CapabilitiesFormControl
                  onChange={(e: any, name: string) =>
                    capabilityCheckboxChanged(e, name, setFieldValue)
                  }
                />

                <Box mt={3}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    {isEdit ? "Edit" : "Add"}
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(null);
            }}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
