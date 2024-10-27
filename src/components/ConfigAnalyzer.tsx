import React from 'react';
import { FileJson, CheckCircle2, XCircle } from 'lucide-react';
import { useConfigAnalyzer } from '../hooks/useConfigAnalyzer';
import type { ConfigFile, ConfigCheck } from '../types';

interface ConfigAnalyzerProps {
  scanning: boolean;
}

export function ConfigAnalyzer({ scanning }: ConfigAnalyzerProps) {
  const { configs, loading } = useConfigAnalyzer(scanning);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {configs.map((config) => (
          <ConfigCard key={config.name} {...config} />
        ))}
      </div>

      {loading && (
        <div className="mt-6 bg-gray-900 rounded-lg p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigCard({ name, status, checks }: ConfigFile) {
  const getStatusColor = () => {
    switch (status) {
      case 'optimal':
        return 'text-emerald-400';
      case 'needs-attention':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileJson className={`w-5 h-5 ${getStatusColor()}`} />
          <span className="font-medium">{name}</span>
        </div>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            status === 'optimal'
              ? 'bg-emerald-400/10 text-emerald-400'
              : status === 'needs-attention'
              ? 'bg-yellow-400/10 text-yellow-400'
              : 'bg-red-400/10 text-red-400'
          }`}
        >
          {status}
        </span>
      </div>
      <div className="space-y-2">
        {checks.map((check, index) => (
          <CheckItem key={index} {...check} />
        ))}
      </div>
    </div>
  );
}

function CheckItem({ name, passed, details, suggestion }: ConfigCheck) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300">{name}</span>
        {passed ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        ) : (
          <XCircle className="w-4 h-4 text-yellow-400" />
        )}
      </div>
      {!passed && (details || suggestion) && (
        <div className="mt-1 text-xs text-gray-400">
          {details && <p>{details}</p>}
          {suggestion && (
            <p className="text-yellow-400 mt-1">
              Suggestion: {suggestion}
            </p>
          )}
        </div>
      )}
    </div>
  );
}