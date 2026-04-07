export const PAGES = {
    HOME: '/',
    TEMPLATES: '/templates',

    USER_BARDS: (userId: string) => `/u/${userId}/boards`,

    WORKSPACE_HOME: (workspaceId: string) => `/w/${workspaceId}/home`,
    WORKSPACE_MEMBERS: (workspaceId: string) => `/w/${workspaceId}/members`,
    WORKSPACE_ACCOUNT: (workspaceId: string) => `/w/${workspaceId}/account`,
}