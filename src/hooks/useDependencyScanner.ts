import { useState, useEffect } from 'react';
import { Dependency } from '../types';
import { fetchLatestVersions } from '../utils/packageUtils';

export function useDependencyScanner(scanning: boolean) {
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scanning && !loading) {
      const scanDependencies = async () => {
        setLoading(true);
        try {
          const pkgJson = await import('../../package.json');
          const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
          
          const depsArray = await Promise.all(
            Object.entries(deps).map(async ([name, version]) => {
              const currentVersion = version.replace('^', '');
              const latest = await fetchLatestVersions(name);
              
              return {
                name,
                currentVersion,
                latestVersion: latest,
                status: latest === currentVersion ? 'up-to-date' : 'outdated'
              } as Dependency;
            })
          );

          setDependencies(depsArray);
        } catch (error) {
          console.error('Error scanning dependencies:', error);
        } finally {
          setLoading(false);
        }
      };

      scanDependencies();
    }
  }, [scanning]);

  return { dependencies, loading };
}