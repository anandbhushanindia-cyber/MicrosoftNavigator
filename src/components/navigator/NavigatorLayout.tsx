import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface NavigatorLayoutProps {
  children: React.ReactNode;
}

export const NavigatorLayout: React.FC<NavigatorLayoutProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* Ambient Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(59,130,246,0.12), transparent 45%),
              radial-gradient(circle at 80% 80%, rgba(99,102,241,0.12), transparent 45%)
            `
          }}
        />
      </div>

      {/* Shell */}
      <div className="relative h-full flex flex-col">

        {/* Header */}
        <header className="shrink-0 bg-white/85 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              {/* Brand Block */}
              <div className="flex items-center gap-4">
                <span className="text-blue-600 text-xl font-semibold tracking-tight">
                  IBM
                </span>

                <div className="w-px h-7 bg-gray-300" />

                <span className="text-gray-700 text-lg font-medium tracking-tight">
                  Microsoft
                </span>
              </div>

              {/* Context Meta */}
              <div className="flex items-center gap-4 text-gray-500 text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  Bangalore
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  March 8, 2026
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};
