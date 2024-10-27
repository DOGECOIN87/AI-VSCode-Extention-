import { useState, useEffect } from 'react';
import type { Settings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('ide-assistant-settings');
    return stored ? JSON.parse(stored) : { openAiKey: '' };
  });

  useEffect(() => {
    localStorage.setItem('ide-assistant-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const validateApiKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  };

  return { settings, updateSettings, validateApiKey };
}