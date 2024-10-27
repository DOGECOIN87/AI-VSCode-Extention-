import { useState, useEffect } from 'react';
import { AIService } from '../services/aiService';
import { useSettings } from './useSettings';

export function useAIScanner() {
  const { settings } = useSettings();
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startScan = async () => {
    if (!settings.openAiKey) {
      setError('API key not configured');
      return;
    }

    setScanning(true);
    setError(null);

    try {
      const aiService = new AIService(settings.openAiKey);
      
      // Get package.json content
      const pkgJson = await import('../../package.json');
      const allDependencies = {
        ...pkgJson.dependencies,
        ...pkgJson.devDependencies
      };

      // Perform deep scan
      const scanResults = await aiService.performDeepScan(allDependencies);
      setResults(scanResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during scanning');
    } finally {
      setScanning(false);
    }
  };

  return {
    scanning,
    results,
    error,
    startScan
  };
}