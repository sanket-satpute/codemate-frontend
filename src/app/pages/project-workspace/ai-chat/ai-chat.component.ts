import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For input elements
import { MarkdownToHtmlPipe } from '../../../shared/pipes/markdown-to-html.pipe'; // Corrected import path for the custom pipe

// --- Data Interfaces for AI Chat Page ---

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string; // Can be plain text or markdown
  isCode?: boolean; // True if content is a code block
  language?: string; // e.g., 'typescript', 'java'
  timestamp: string;
  isExpanded?: boolean; // For expand/collapse long answers
  quickActions?: string[]; // e.g., 'Explain this code', 'Fix this error'
  isLoading?: boolean; // For AI loading animation
}

interface ProjectSummary {
  techStack: string[];
  linesOfCode: string;
  frameworks: string[];
  languagesBreakdown: string[];
}

interface IssueSummary {
  source: string; // e.g., 'Code Analysis', 'Code Quality'
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

interface FileNode {
  name: string;
  path: string;
  isFolder: boolean;
  children?: FileNode[];
  isExpanded?: boolean;
}

interface ToolItem {
  label: string;
  icon: string; // Font Awesome class
  action: string; // Method name to call
}

interface CodeDiff {
  fileName: string;
  before: string; // Original code
  after: string;  // Suggested new code
  type: 'side-by-side' | 'unified';
}

interface FileContextTab {
  name: string;
  path: string;
  content: string; // Actual file content
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownToHtmlPipe], // Add MarkdownToHtmlPipe here
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss'
})
export class AiChatComponent implements OnInit {
  // Top Bar (Header)
  pageTitle: string = 'AI Chat';
  pageSubtitle: string = 'Project-aware conversational assistant';

  // Left Sidebar — Project Context Panel
  isSidebarOpen: boolean = true;
  projectSummary: ProjectSummary = {
    techStack: ['Angular', 'Spring Boot', 'Java', 'TypeScript', 'Node.js', 'PostgreSQL'],
    linesOfCode: '150k+',
    frameworks: ['Angular', 'Spring Boot'],
    languagesBreakdown: ['TypeScript (60%)', 'Java (30%)', 'SCSS (10%)'],
  };
  recentIssues: IssueSummary[] = [
    { source: 'Code Analysis', title: 'Hardcoded API key', severity: 'Critical' },
    { source: 'Security Audit', title: 'Outdated dependency', severity: 'High' },
    { source: 'Code Quality', title: 'Long method detected', severity: 'Medium' },
    { source: 'UI/UX Audit', title: 'Inconsistent button styles', severity: 'Low' },
    { source: 'Performance Audit', title: 'Inefficient loop', severity: 'Low' },
  ];
  projectFiles: FileNode[] = [
    {
      name: 'src', path: 'src', isFolder: true, isExpanded: true, children: [
        { name: 'app', path: 'src/app', isFolder: true, isExpanded: true, children: [
          { name: 'components', path: 'src/app/components', isFolder: true, children: [] },
          { name: 'services', path: 'src/app/services', isFolder: true, children: [] },
          { name: 'configs', path: 'src/app/configs', isFolder: true, children: [] },
          { name: 'main.ts', path: 'src/app/main.ts', isFolder: false },
        ]},
        { name: 'assets', path: 'src/assets', isFolder: true, children: [] },
      ],
    },
    { name: 'package.json', path: 'package.json', isFolder: false },
  ];

  // Main Chat Area
  currentProjectName: string = 'CodeMate AI Monorepo';
  modelSelected: string = 'CodeMate-Pro-v3';
  activeMode: 'Coding' | 'Debugging' | 'Documentation' | 'Explanation' | 'Architecture' = 'Coding';
  
  chatMessages: ChatMessage[] = [
    {
      id: 'msg1', sender: 'user', timestamp: '10:00 AM',
      content: 'Analyze the login function in `auth.service.ts` for potential security vulnerabilities.'
    },
    {
      id: 'msg2', sender: 'ai', timestamp: '10:01 AM', isLoading: true,
      content: 'Analyzing `auth.service.ts` login function for security vulnerabilities...'
    },
    {
      id: 'msg3', sender: 'ai', timestamp: '10:02 AM', isCode: true, language: 'typescript', isExpanded: false,
      content: `// src/app/core/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'https://api.codescope.com/auth';

  constructor(private http: HttpClient) { }

  login(credentials: any) {
    // CRITICAL: Hardcoded credentials for demo - SHOULD BE REMOVED
    if (credentials.username === "admin" && credentials.password === "password123") {
      return this.http.post(\`\${this.API_URL}/login\`, credentials);
    }
    throw new Error('Invalid Credentials');
  }
}`,
      quickActions: ['Explain this code', 'Fix this error', 'Refactor']
    },
    {
      id: 'msg4', sender: 'ai', timestamp: '10:02 AM',
      content: 'The `login` function in `auth.service.ts` contains hardcoded credentials (`admin` and `password123`) for demonstration purposes. This is a **Critical** security vulnerability and should be replaced with a secure authentication mechanism that relies on your backend for credential validation. I recommend removing the direct comparison and relying solely on the HTTP POST request to your API for authentication.',
      quickActions: ['Fix this error', 'Generate test cases']
    },
    {
      id: 'msg5', sender: 'user', timestamp: '10:05 AM',
      content: 'Show me the diff for a suggested fix.'
    },
    {
      id: 'msg6', sender: 'ai', timestamp: '10:06 AM',
      content: 'Here is a suggested fix for the hardcoded credentials:',
      quickActions: ['Apply fix', 'Explain changes']
    }
  ];

  // Right Tools Drawer
  isToolsDrawerOpen: boolean = false;
  availableTools: ToolItem[] = [
    { label: 'Run Lint', icon: 'fas fa-check-double', action: 'runLint' },
    { label: 'Run Code Quality Scan', icon: 'fas fa-chart-line', action: 'runCodeQualityScan' },
    { label: 'Run Security Scan', icon: 'fas fa-shield-alt', action: 'runSecurityScan' },
    { label: 'Generate Docs', icon: 'fas fa-file-alt', action: 'generateDocs' },
    { label: 'Generate Test Cases', icon: 'fas fa-vial', action: 'generateTestCases' },
  ];

  // Bottom Input Section
  chatInput: string = '';
  dragOver: boolean = false; // For drag and drop styling
  
  // Extra Features
  codeDiffViewer: CodeDiff | null = {
    fileName: 'src/app/core/auth.service.ts',
    before: `  login(credentials: any) {
    // CRITICAL: Hardcoded credentials for demo - SHOULD BE REMOVED
    if (credentials.username === "admin" && credentials.password === "password123") {
      return this.http.post(\`\${this.API_URL}/login\`, credentials);
    }
    throw new Error('Invalid Credentials');
  }`,
    after: `  login(credentials: any) {
    // Rely on backend for authentication
    return this.http.post(\`\${this.API_URL}/login\`, credentials);
  }`,
    type: 'side-by-side'
  };

  fileContextTabs: FileContextTab[] = [
    { name: 'auth.service.ts', path: 'src/app/core/auth.service.ts', content: '// Actual content...' },
    { name: 'user.model.ts', path: 'src/app/core/models/user.model.ts', content: '// Actual content...' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // --- UI Interaction Methods ---

  // Top Bar Actions
  clearChat(): void {
    console.log('Clearing chat...');
    this.chatMessages = [];
    this.codeDiffViewer = null;
    this.fileContextTabs = [];
  }
  downloadConversation(): void { console.log('Downloading conversation...'); }
  openSettings(): void { console.log('Opening settings (model options)...'); }

  // Left Sidebar Actions
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log('Sidebar toggled:', this.isSidebarOpen);
  }
  toggleFileNode(node: FileNode, event: Event): void {
    event.stopPropagation();
    if (node.isFolder) {
      node.isExpanded = !node.isExpanded;
    }
    console.log('Toggled file node:', node.name);
  }
  selectFileForContext(file: FileNode): void {
    if (!file.isFolder) {
      console.log('Selected file for context:', file.path);
      // In a real app, you'd fetch file content and add to context tabs
      if (!this.fileContextTabs.some(tab => tab.path === file.path)) {
        this.fileContextTabs.push({ name: file.name, path: file.path, content: `// Content of ${file.name}` });
      }
    }
  }

  // Main Chat Area Actions
  toggleMessageExpand(message: ChatMessage): void {
    message.isExpanded = !message.isExpanded;
  }
  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
    console.log('Code copied to clipboard.');
    // Potentially add a small toast notification here
  }
  performQuickAction(action: string, messageId: string): void {
    console.log(`Performing quick action: "${action}" for message: ${messageId}`);
    // Logic for quick actions would go here
  }
  closeFileContextTab(tab: FileContextTab): void {
    this.fileContextTabs = this.fileContextTabs.filter(t => t.path !== tab.path);
    console.log('Closed file context tab:', tab.name);
  }

  // Right Tools Drawer Actions
  toggleToolsDrawer(): void {
    this.isToolsDrawerOpen = !this.isToolsDrawerOpen;
    console.log('Tools drawer toggled:', this.isToolsDrawerOpen);
  }
  executeTool(toolAction: string): void {
    console.log(`Executing tool: ${toolAction}`);
    // In a real app, this would trigger the actual tool function
    // Example: (this as any)[toolAction](); // Call a method on the component
  }

  // Bottom Input Section Actions
  sendMessage(): void {
    if (this.chatInput.trim()) {
      const newUserMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        content: this.chatInput,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      this.chatMessages.push(newUserMessage);
      this.chatInput = '';
      this.simulateAiResponse();
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const files = Array.from(event.dataTransfer.files);
      console.log('Files dropped:', files.map(f => f.name));
      // Handle file uploads here
    }
  }

  private simulateAiResponse(): void {
    const aiResponse: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      content: 'Thinking...',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isLoading: true
    };
    this.chatMessages.push(aiResponse);

    setTimeout(() => {
      aiResponse.isLoading = false;
      aiResponse.content = 'I have processed your request. How can I assist further?'; // Replace with actual AI response logic
      aiResponse.quickActions = ['Explain this', 'Generate test', 'Refactor'];
    }, 2000);
  }
}
