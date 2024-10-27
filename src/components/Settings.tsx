import React, { useState } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Settings as SettingsType } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsType;
  onUpdate: (settings: SettingsType) => void;
  onValidateApiKey: (key: string) => Promise<boolean>;
}

export function Settings({ isOpen, onClose, settings, onUpdate, onValidateApiKey }: SettingsProps) {
  const [apiKey, setApiKey] = useState(settings.openAiKey || '');
  const [validating, setValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleValidateKey = async () => {
    setValidating(true);
    try {
      const valid = await onValidateApiKey(apiKey);
      setIsValid(valid);
      if (valid) {
        onUpdate({ ...settings, openAiKey: apiKey });
      }
    } catch (error) {
      setIsValid(false);
    } finally {
      setValidating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="sk-..."
              />
              {isValid !== null && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              )}
            </div>
            {isValid === false && (
              <p className="mt-2 text-sm text-red-400">
                Invalid API key. Please check and try again.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleValidateKey}
              disabled={!apiKey || validating}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {validating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>Save & Validate</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}