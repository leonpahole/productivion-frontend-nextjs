// ADD CAPABILITY
export interface UserCapabilities {
  canUpdateProject: boolean;
  canDeleteProject: boolean;
  canAddTask: boolean;
  canUpdateTask: boolean;
  canDeleteTask: boolean;
  canCompleteTask: boolean;
  canManageProjectUsers: boolean;
  canComment: boolean;
  canUpdateOtherComments: boolean;
  canDeleteOtherComments: boolean;
}

interface RoleInfo {
  name: string;
  capabilities: UserCapabilities;
}

export const RolePresets: Record<number, RoleInfo> = {
  0: {
    name: "Custom",
    capabilities: {
      canUpdateProject: false,
      canDeleteProject: false,
      canAddTask: false,
      canUpdateTask: false,
      canDeleteTask: false,
      canCompleteTask: false,
      canManageProjectUsers: false,
      canComment: false,
      canUpdateOtherComments: false,
      canDeleteOtherComments: false,
    },
  },
  1: {
    name: "Administrator",
    capabilities: {
      canUpdateProject: true,
      canDeleteProject: true,
      canAddTask: true,
      canUpdateTask: true,
      canDeleteTask: true,
      canCompleteTask: true,
      canManageProjectUsers: true,
      canComment: true,
      canUpdateOtherComments: true,
      canDeleteOtherComments: true,
    },
  },
  2: {
    name: "Project manager",
    capabilities: {
      canUpdateProject: true,
      canDeleteProject: false,
      canAddTask: true,
      canUpdateTask: true,
      canDeleteTask: true,
      canCompleteTask: true,
      canManageProjectUsers: false,
      canComment: true,
      canUpdateOtherComments: false,
      canDeleteOtherComments: false,
    },
  },
  3: {
    name: "Developer",
    capabilities: {
      canUpdateProject: false,
      canDeleteProject: false,
      canAddTask: false,
      canUpdateTask: true,
      canDeleteTask: false,
      canCompleteTask: true,
      canManageProjectUsers: false,
      canComment: true,
      canUpdateOtherComments: false,
      canDeleteOtherComments: false,
    },
  },
  4: {
    name: "Viewer",
    capabilities: {
      canUpdateProject: false,
      canDeleteProject: false,
      canAddTask: false,
      canUpdateTask: false,
      canDeleteTask: false,
      canCompleteTask: false,
      canManageProjectUsers: false,
      canComment: false,
      canUpdateOtherComments: false,
      canDeleteOtherComments: false,
    },
  },
};

export const rolesOptions = Object.entries(RolePresets)
  .map((roleDesc: any) => {
    const roleId = Number(roleDesc[0]);
    if (roleId === 1) {
      return null;
    }

    return {
      value: roleId,
      name: roleDesc[1].name,
    };
  })
  .filter((r) => r != null);

export const isAdmin = (presetId: number | null | undefined) => {
  if (!presetId) {
    return false;
  }

  const roleName = renderRoleName(presetId);
  return roleName.includes("Administrator");
};

export const renderRoleName = (id: number | null | undefined) => {
  if (!id) {
    return "";
  }

  if (id < 1 || id > 4) {
    return "";
  }

  return RolePresets[id].name;
};
