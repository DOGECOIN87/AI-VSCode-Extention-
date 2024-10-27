export async function fetchLatestVersions(packageName: string): Promise<string> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    const data = await response.json();
    return data.version;
  } catch (error) {
    console.error(`Error fetching version for ${packageName}:`, error);
    return 'unknown';
  }
}

export async function checkVulnerabilities(packageName: string, version: string) {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/-/npm/v1/security/advisories/search?package=${packageName}`
    );
    const data = await response.json();
    return data.advisories || [];
  } catch (error) {
    console.error(`Error checking vulnerabilities for ${packageName}:`, error);
    return [];
  }
}