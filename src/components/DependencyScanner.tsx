import React from 'react';
import { Package, AlertCircle, Shield } from 'lucide-react';
import { useDependencyScanner } from '../hooks/useDependencyScanner';
import type { Dependency } from '../types';

interface DependencyScannerProps {
  scanning: boolean;
}

export function DependencyScanner({ scanning }: DependencyScannerProps) {
  const { dependencies, loading } = useDependencyScanner(scanning);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dependencies.map((dep) => (
          <DependencyCard key={dep.name} {...dep} />
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

function DependencyCard({
  name,
  currentVersion,
  latestVersion,
  status,
  vulnerabilities,
}: Dependency) {
  const getStatusColor = () => {
    switch (status) {
      case 'up-to-date':
        return 'text-emerald-400';
      case 'outdated':
        return 'text-yellow-400';
      case 'vulnerable':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">{name}</span>
        </div>
        {status !== 'up-to-date' && (
          <div className="flex space-x-2">
            {vulnerabilities && vulnerabilities.length > 0 && (
              <Shield className="w-5 h-5 text-red-400" />
            )}
            <AlertCircle className={`w-5 h-5 ${getStatusColor()}`} />
          </div>
        )}
      </div>
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Current</span>
          <span className="font-mono">{currentVersion}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Latest</span>
          <span className="font-mono">{latestVersion}</span>
        </div>
      </div>
      {vulnerabilities && vulnerabilities.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-800">
          <p className="text-xs text-red-400">
            {vulnerabilities.length} security {vulnerabilities.length === 1 ? 'issue' : 'issues'} found
          </p>
        </div>
      )}
    </div>
  );
}