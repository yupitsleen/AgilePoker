import React from 'react';
import { useRoomStore } from '../../stores/roomStore';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { room, currentPage, setCurrentPage } = useRoomStore();

  if (!room) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* App Name */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Agile Poker</h1>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage('poker')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'poker'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Planning Poker
              </button>
              <button
                onClick={() => setCurrentPage('triangle')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'triangle'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Project Triangle
              </button>

              {/* Room code on mobile */}
              <div className="md:hidden text-sm font-mono font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded">
                {room.roomId}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
};
