import React, { useState } from 'react';
import { Terminal, Zap, AlertCircle, CheckCircle2, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { DependencyScanner } from './components/DependencyScanner';
import { ConfigAnalyzer } from './components/ConfigAnalyzer';
import { SolutionViewer } from './components/SolutionViewer';
import { Settings } from './components/Settings';
import { useSettings } from './hooks/useSettings';

function App() {
  const [scanning, setScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'dependencies' | 'config'>('dependencies');
  const [showSettings, setShowSettings] = useState(false);
  const { settings, updateSettings, validateApiKey } = useSettings();

  const handleScan = async () => {
    if (!settings.openAiKey) {
      setShowSettings(true);
      return;
    }
    setScanning(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm fixed top-0 w-full z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-8 h-8 text-emerald-400" />
            <h1 className="text-xl font-bold">AI IDE Assistant</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleScan}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={scanning}
            >
              {scanning ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              <span>{scanning ? 'Scanning...' : 'Start Scan'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab('dependencies')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'dependencies'
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Dependencies
                </button>
                <button
                  onClick={() => setActiveTab('config')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'config'
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Configuration
                </button>
              </div>
              
              {activeTab === 'dependencies' ? (
                <DependencyScanner scanning={scanning} />
              ) : (
                <ConfigAnalyzer scanning={scanning} />
              )}
            </div>

            <SolutionViewer />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">System Status</h2>
              <div className="space-y-4">
                <StatusItem
                  icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  label="Package Manager"
                  value="npm@10.2.4"
                />
                <StatusItem
                  icon={<AlertCircle className="w-5 h-5 text-yellow-400" />}
                  label="Outdated Dependencies"
                  value="3 packages"
                />
                <StatusItem
                  icon={settings.openAiKey ? 
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : 
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  }
                  label="AI Integration"
                  value={settings.openAiKey ? "Connected" : "Not Connected"}
                />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  'Updated React to 18.3.1',
                  'Fixed TypeScript configuration',
                  'Optimized build settings',
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-300 pb-3 border-b border-gray-700 last:border-0"
                  >
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Settings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdate={updateSettings}
        onValidateApiKey={validateApiKey}
      />
    </div>
  );
}

interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatusItem({ icon, label, value }: StatusItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-gray-300">{label}</span>
      </div>
      <span className="text-sm font-mono bg-gray-900 px-2 py-1 rounded">
        {value}
      </span>
    </div>
  );
}

export default App;