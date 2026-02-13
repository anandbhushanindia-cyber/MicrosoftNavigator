import React, { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, X, Settings } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

export const AdminToolbar: React.FC = () => {
  const {
    isAdminMode,
    setIsAdminMode,
    exportConfig,
    importConfig,
    resetToDefaults,
    hasChanges,
    changeCount,
  } = useAdmin();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isAdminMode) return null;

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importConfig(file);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (showResetConfirm) {
      resetToDefaults();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      // Auto-dismiss after 3 seconds
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Toolbar card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 flex items-center gap-2">
        {/* Admin badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
          <Settings className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
          Admin
          {hasChanges && (
            <span className="ml-1 bg-white text-blue-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
              {changeCount}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Export */}
        <button
          type="button"
          onClick={exportConfig}
          title="Export configuration"
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Import */}
        <button
          type="button"
          onClick={handleImportClick}
          title="Import configuration"
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Upload className="w-4 h-4" />
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={handleReset}
          title={showResetConfirm ? 'Click again to confirm reset' : 'Reset to defaults'}
          className={`p-2 rounded-lg transition-colors ${
            showResetConfirm
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'hover:bg-gray-100 text-gray-600 hover:text-orange-600'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Exit admin */}
        <button
          type="button"
          onClick={() => setIsAdminMode(false)}
          title="Exit admin mode"
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Reset confirmation tooltip */}
      {showResetConfirm && (
        <div className="bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg">
          Click reset again to confirm
        </div>
      )}
    </div>
  );
};
