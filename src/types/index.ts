export interface Dependency {
  name: string;
  currentVersion: string;
  latestVersion: string;
  status: 'up-to-date' | 'outdated' | 'vulnerable';
  vulnerabilities?: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
}

export interface ConfigCheck {
  name: string;
  passed: boolean;
  details?: string;
  suggestion?: string;
}

export interface ConfigFile {
  name: string;
  status: 'optimal' | 'needs-attention' | 'critical';
  checks: ConfigCheck[];
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  code: string;
  type: 'dependency' | 'config' | 'security';
  severity: 'low' | 'medium' | 'high';
  automated: boolean;
}

export interface Settings {
  openAiKey: string;
}