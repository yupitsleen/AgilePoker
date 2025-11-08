import React, { useState } from 'react';
import { useRoomStore, getOrCreateUser } from '../stores/roomStore';

export const Home: React.FC = () => {
  const { createRoom, joinRoom, setCurrentUser } = useRoomStore();
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = () => {
    const user = getOrCreateUser();
    setCurrentUser(user);
    createRoom();
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      alert('Please enter a room code');
      return;
    }

    const user = getOrCreateUser();
    setCurrentUser(user);
    joinRoom(roomCode.trim().toUpperCase(), user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Agile Poker
          </h1>
          <p className="text-blue-100 text-lg">
            Collaborative Planning Poker & Project Triangle Tool
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Create Room */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Start a New Session
            </h2>
            <button
              onClick={handleCreateRoom}
              className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition-colors shadow-md hover:shadow-lg"
            >
              Create Room
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
            </div>
          </div>

          {/* Join Room */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Join Existing Room
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code (e.g., ABC123)"
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono text-center uppercase"
                onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              />
              <button
                onClick={handleJoinRoom}
                className="w-full py-4 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-lg transition-colors shadow-md hover:shadow-lg"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-2 gap-4 text-white">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🃏</div>
              <div className="font-semibold">Planning Poker</div>
              <div className="text-sm text-blue-100">Story pointing</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">📐</div>
              <div className="font-semibold">Project Triangle</div>
              <div className="text-sm text-blue-100">Priority selection</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
