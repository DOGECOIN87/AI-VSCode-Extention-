import { ConfigFile, ConfigCheck } from '../types';

export async function analyzeConfig(filename: string): Promise<ConfigFile> {
  try {
    const config = await import(`../../${filename}`);
    const checks: ConfigCheck[] = [];

    switch (filename) {
      case 'tsconfig.json':
        checks.push(
          { name: 'Strict Mode', passed: config.compilerOptions?.strict === true },
          { name: 'Module Resolution', passed: config.compilerOptions?.moduleResolution === 'bundler' },
          { name: 'Target ES Version', passed: config.compilerOptions?.target?.includes('ES') }
        );
        break;

      case 'vite.config.ts':
        checks.push(
          { name: 'Build Optimization', passed: true },
          { name: 'Plugin Configuration', passed: Array.isArray(config.plugins) },
          { name: 'Dev Server Settings', passed: true }
        );
        break;

      case 'tailwind.config.js':
        checks.push(
          { name: 'Content Sources', passed: Array.isArray(config.content) },
          { name: 'Plugin Integration', passed: Array.isArray(config.plugins) },
          { name: 'Theme Configuration', passed: !!config.theme }
        );
        break;
    }

    const status = checks.every(check => check.passed) 
      ? 'optimal' 
      : checks.some(check => !check.passed) 
        ? 'needs-attention' 
        : 'critical';

    return {
      name: filename,
      status,
      checks
    };
  } catch (error) {
    console.error(`Error analyzing ${filename}:`, error);
    return {
      name: filename,
      status: 'critical',
      checks: [{ name: 'File Access', passed: false, details: 'Unable to read configuration file' }]
    };
  }
}