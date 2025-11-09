import React from 'react';
import { useRoomStore } from '../../stores/roomStore';

export const Sidebar: React.FC = () => {
  const { room, currentUser, sidebarOpen, setSidebarOpen, leaveRoom } = useRoomStore();

  if (!room) return null;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.roomId);
    alert('Room code copied to clipboard!');
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}?room=${room.roomId}`;
    navigator.clipboard.writeText(link);
    alert('Room link copied to clipboard!');
  };

  const handleLeaveRoom = () => {
    if (confirm('Are you sure you want to leave this room?')) {
      leaveRoom();
    }
  };

  const participantCount = room.participants.length;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:z-auto
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                In Room ({participantCount})
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Room Code */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
              <span className="font-mono text-sm font-semibold text-gray-700">
                {room.roomId}
              </span>
              <button
                onClick={copyRoomCode}
                className="ml-auto text-blue-600 hover:text-blue-700 text-sm font-medium"
                title="Copy room code"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Participant List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {room.participants.map((participant) => {
                const isCurrentUser = participant.userId === currentUser?.userId;
                const isAdmin = participant.userId === room.adminUserId;
                const hasVoted = participant.hasVoted;

                return (
                  <div
                    key={participant.userId}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: participant.avatarColor || '#6B7280' }}
                    >
                      {participant.name.substring(0, 2).toUpperCase()}
                    </div>

                    {/* Name and badges */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">
                          {participant.name}
                          {isCurrentUser && (
                            <span className="ml-1 text-xs text-gray-500">(You)</span>
                          )}
                        </span>
                        {isAdmin && (
                          <span className="text-yellow-500" title="Admin">
                            👑
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status indicators */}
                    <div className="flex items-center gap-2">
                      {hasVoted && (
                        <span className="text-green-500" title="Voted">
                          ✓
                        </span>
                      )}
                      <div
                        className={`w-2 h-2 rounded-full ${
                          participant.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                        title={participant.isActive ? 'Active' : 'Inactive'}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={copyRoomLink}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Invite
            </button>
            <button
              onClick={handleLeaveRoom}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 right-4 z-30 md:hidden bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {participantCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {participantCount}
              </span>
            )}
          </div>
        </button>
      )}
    </>
  );
};
