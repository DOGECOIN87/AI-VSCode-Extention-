import React, { useState } from 'react';
import { Code2, Copy, CheckCheck } from 'lucide-react';
import { Solution } from '../types';

export function SolutionViewer() {
  const [solutions] = useState<Solution[]>([
    {
      id: 'tailwind-plugins',
      title: 'Update Tailwind Configuration',
      description: 'Add recommended plugins to enhance your Tailwind setup',
      code: `module.exports = {
  // ... existing config
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}`,
      type: 'config',
      severity: 'medium',
      automated: true
    }
  ]);

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Code2 className="w-6 h-6 text-emerald-400" />
          <span>Recommended Solutions</span>
        </h2>
      </div>

      <div className="space-y-4">
        {solutions.map((solution) => (
          <SolutionCard key={solution.id} {...solution} />
        ))}
      </div>
    </div>
  );
}

function SolutionCard({ title, description, code, type, severity, automated }: Solution) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full
              ${type === 'security' ? 'bg-red-400/10 text-red-400' :
                type === 'dependency' ? 'bg-blue-400/10 text-blue-400' :
                'bg-purple-400/10 text-purple-400'}`}>
              {type}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full
              ${severity === 'high' ? 'bg-red-400/10 text-red-400' :
                severity === 'medium' ? 'bg-yellow-400/10 text-yellow-400' :
                'bg-emerald-400/10 text-emerald-400'}`}>
              {severity}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div className="relative">
        <pre className="bg-gray-950 p-4 overflow-x-auto">
          <code className="text-sm font-mono text-gray-300">{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          {copied ? (
            <CheckCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      {automated && (
        <div className="px-4 py-2 bg-gray-950 border-t border-gray-800">
          <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            Apply automatically
          </button>
        </div>
      )}
    </div>
  );
}