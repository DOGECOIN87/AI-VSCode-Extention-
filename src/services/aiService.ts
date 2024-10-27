import { Dependency, ConfigFile, Solution } from '../types';
import { checkVulnerabilities } from '../utils/packageUtils';

interface DependencyContext {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface AnalysisResult {
  issues: Issue[];
  suggestions: Solution[];
  securityAlerts: SecurityAlert[];
}

interface Issue {
  type: 'dependency' | 'config' | 'security';
  severity: 'low' | 'medium' | 'high';
  description: string;
  context: string;
  solution?: string;
  references?: string[];
}

interface SecurityAlert {
  packageName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  vulnerability: string;
  recommendation: string;
  references?: string[];
}

export class AIService {
  private apiKey: string;
  private systemPrompt = `You are an advanced AI dependency and configuration analyzer with real-time internet search capabilities. Your primary responsibilities are to:

1. SEARCH & VALIDATE:
   - Actively search official documentation, GitHub issues, and trusted sources
   - Verify all information against multiple reliable sources
   - Never make assumptions without factual backing
   - Track and cite all information sources

2. DEPENDENCY ANALYSIS:
   - Scan the complete dependency tree for compatibility issues
   - Cross-reference versions with latest releases
   - Identify deprecated packages and suggest alternatives
   - Validate peer dependencies and version constraints
   - Check for known bugs and regressions

3. SECURITY ASSESSMENT:
   - Monitor security advisories and CVE databases
   - Analyze potential security implications
   - Identify vulnerable dependencies
   - Suggest secure alternatives
   - Provide detailed mitigation steps

4. CONFIGURATION VALIDATION:
   - Verify against latest best practices
   - Check for misconfigurations
   - Identify deprecated options
   - Suggest performance optimizations
   - Ensure environment compatibility

5. AUTOMATED FIXES:
   - Generate precise fix instructions
   - Provide automated update commands
   - Include rollback procedures
   - Validate changes before applying
   - Test for side effects

6. DOCUMENTATION:
   - Link to official documentation
   - Cite relevant GitHub issues
   - Reference community solutions
   - Provide migration guides
   - Include example configurations

Remember: Every suggestion must be fact-checked and include references to documentation or trusted sources. Never guess or assume - always verify through active research.`;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Rest of the file remains unchanged
}