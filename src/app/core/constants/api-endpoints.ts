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
  },
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id: string) => `/projects/${id}`,
    START_ANALYSIS: (id: string) => `/projects/${id}/analysis/start`,
    ANALYSIS_JOBS: (id: string) => `/projects/${id}/analysis/jobs`,
    ANALYSIS_JOB_BY_ID: (projectId: string, jobId: string) => `/projects/${projectId}/analysis/jobs/${jobId}`,
    ISSUES: (projectId: string) => `/projects/${projectId}/issues`,
    APPLY_FIX: (projectId: string) => `/projects/${projectId}/apply-fix`,
    FILES: (projectId: string) => `/projects/${projectId}/files`,
    FILE_CONTENT: (projectId: string) => `/projects/${projectId}/file-content`,
  },
  PROJECT_FILES: {
    UPLOAD: (projectId: string) => `/files/upload?projectId=${projectId}`,
    LIST: (projectId: string) => `/files/project/${projectId}`,
    DELETE: (fileId: string) => `/files/${fileId}`,
    CONTENT: (fileId: string) => `/files/${fileId}/content`,
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
    CLEAR: '/notifications/clear',
  },
  EXPORT: {
    BY_JOB: (jobId: string) => `/export/${jobId}`,
    PDF: (reportId: string) => `/export/${reportId}/pdf`,
  },
  COVERAGE: {
    SUMMARY: (projectId: string) => `/coverage/${projectId}/summary`,
    FILES: (projectId: string) => `/coverage/${projectId}/files`,
    GENERATE_TESTS: (projectId: string) => `/coverage/${projectId}/generate-tests`,
  },
  SECURITY: {
    SUMMARY: (projectId: string) => `/security/${projectId}/summary`,
    VULNERABILITIES: (projectId: string) => `/security/${projectId}/vulnerabilities`,
    HEATMAP: (projectId: string) => `/security/${projectId}/heatmap`,
  },
  PERFORMANCE: {
    BOTTLENECKS: (projectId: string) => `/performance/bottlenecks/${projectId}`,
    STREAM: (projectId: string) => `/performance/stream/${projectId}`,
  },
  DEPENDENCIES: {
    GRAPH: (projectId: string) => `/dependencies/${projectId}/graph`,
    IMPACT: (projectId: string, nodeId: string) => `/dependencies/${projectId}/impact/${nodeId}`,
  },
  ANALYSIS: {
    SUGGESTIONS: (projectId: string) => `/analysis/${projectId}/suggestions`,
    REFACTOR_PREVIEW: (projectId: string) => `/analysis/${projectId}/refactor-preview`,
    RESULT: (jobId: string) => `/analysis/${jobId}/result`,
    PROJECT_JOBS: (projectId: string) => `/analysis/jobs/project/${projectId}`,
    RUN_PROJECT: (projectId: string) => `/analysis/jobs/${projectId}/run`,
  },
  AI_FIX: {
    GENERATE: '/ai-fix/generate',
  },
};
