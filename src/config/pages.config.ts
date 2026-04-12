export const PAGES = {
    HOME: '/',
    TEMPLATES: '/templates',

    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',

    USER_BOARDS: (userId: string) => `/u/${userId}/boards`,
    
    WORKSPACE_HOME: (workspaceId: string) => `/w/${workspaceId}/home`,
    WORKSPACE_MEMBERS: (workspaceId: string) => `/w/${workspaceId}/members`,
    WORKSPACE_ACCOUNT: (workspaceId: string) => `/w/${workspaceId}/account`,

    BOARD: (boardId: number, slug: string) => `/b/${boardId}/${slug}`,
    
    CARD: (cardId: string, slug: string) => `/c/${cardId}/${slug}`,

    MAP: ( boardId: number, slug: string, lat: string, lng: string, zoom: string ) => `/b/${boardId}/${slug}/map/${lat}/${lng}/${zoom}`
}