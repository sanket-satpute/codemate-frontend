/**
 * Centralized API endpoint constants.
 *
 * All paths are RELATIVE to `environment.apiUrl` (e.g. http://localhost:8080/api).
 * So if apiUrl = 'http://localhost:8080/api', and the backend controller is
 * @RequestMapping("/api/auth"), the constant here should be '/auth/login'.
 *
 * Backend Controller Mapping:
 *  AuthController       → /api/auth         → /auth/...
 *  ProjectController    → /api/projects      → /projects/...
 *  UploadController     → /api/upload        → /upload/...
 *  ReportController     → /api/reports       → /reports/...
 *  ChatController       → /api/chat          → /chat/...
 *  JobController        → /api/job           → /job/...
 *  DashboardController  → /api/dashboard     → /dashboard
 *  NotificationController → /api/notifications → /notifications/...
 *  ExportController     → /api/export        → /export/...
 *  UserController       → /api/users         → /users/...
 *  AnalysisJobController → /api/projects/{id}/analysis → (via /projects)
 */
export const ApiEndpoints = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  USERS: {
    ME: '/users/me',
    CHANGE_PASSWORD: '/users/change-password',
    CHANGE_EMAIL: '/users/change-email',
    DISABLE_ACCOUNT: '/users/disable-account',
    ENABLE_ACCOUNT: '/users/enable-account',
  },
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id: string) => `/projects/${id}`,
    START_ANALYSIS: (id: string) => `/projects/${id}/analysis/start`,
    ANALYSIS_JOBS: (id: string) => `/projects/${id}/analysis/jobs`,
    ANALYSIS_JOB_BY_ID: (projectId: string, jobId: string) => `/projects/${projectId}/analysis/jobs/${jobId}`,
    FILES: (projectId: string) => `/projects/${projectId}/files`,
    FILE_BY_ID: (projectId: string, fileId: string) => `/projects/${projectId}/files/${fileId}`,
  },
  UPLOAD: {
    FILE: '/upload/file',
    PROJECT: '/upload/project',
  },
  REPORTS: {
    BASE: '/reports',
    BY_PROJECT: (projectId: string) => `/reports/project/${projectId}`,
    BY_ID: (reportId: string) => `/reports/${reportId}`,
    DOWNLOAD: (reportId: string) => `/reports/${reportId}/download`,
  },
  CHAT: {
    SEND: (projectId: string) => `/chat/${projectId}/send`,
    HISTORY: (projectId: string) => `/chat/${projectId}/history`,
    CLEAR: (projectId: string) => `/chat/${projectId}/clear`,
    STREAM: (projectId: string) => `/chat/${projectId}/stream`,
  },
  JOBS: {
    STATUS: (jobId: string) => `/job/${jobId}`,
  },
  DASHBOARD: {
    BASE: '/dashboard',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: '/notifications/mark-read',
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE: (id: string) => `/notifications/${id}`,
    CLEAR: '/notifications/clear',
  },
  EXPORT: {
    BY_JOB: (jobId: string) => `/export/${jobId}`,
    PDF: (reportId: string) => `/export/${reportId}/pdf`,
  },

};
