import { useState, useEffect } from 'react';
import { ConfigFile } from '../types';
import { analyzeConfig } from '../utils/configUtils';

export function useConfigAnalyzer(scanning: boolean) {
  const [configs, setConfigs] = useState<ConfigFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scanning && !loading) {
      const analyzeConfigs = async () => {
        setLoading(true);
        try {
          const configFiles = ['tsconfig.json', 'vite.config.ts', 'tailwind.config.js'];
          const results = await Promise.all(
            configFiles.map(async (file) => {
              return await analyzeConfig(file);
            })
          );
          setConfigs(results);
        } catch (error) {
          console.error('Error analyzing configs:', error);
        } finally {
          setLoading(false);
        }
      };

      analyzeConfigs();
    }
  }, [scanning]);

  return { configs, loading };
}