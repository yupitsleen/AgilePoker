import React from 'react';
import { useRoomStore } from '../stores/roomStore';
import { POKER_CARDS } from '../types';
import type { PokerCard } from '../types';

export const PlanningPoker: React.FC = () => {
  const {
    room,
    currentUser,
    updateStoryLabel,
    submitVote,
    revealVotes,
    nextStory,
    resetVotes,
  } = useRoomStore();

  if (!room?.pokerState) {
    return <div className="p-8">Loading...</div>;
  }

  const { currentStory, participants, history } = room.pokerState;
  const isAdmin = currentUser?.userId === room.adminUserId;
  const currentUserVote = participants.find(p => p.userId === currentUser?.userId)?.vote;
  const votedCount = participants.filter(p => p.hasVoted).length;
  const totalCount = participants.length;

  const handleVote = (card: PokerCard) => {
    if (!currentStory.votesRevealed) {
      submitVote(card);
    }
  };

  const getVoteDistribution = () => {
    const votes = participants
      .filter(p => p.vote !== null)
      .map(p => p.vote!);

    const distribution = new Map<number | string, number>();
    votes.forEach(vote => {
      distribution.set(vote, (distribution.get(vote) || 0) + 1);
    });

    return Array.from(distribution.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([vote, count]) => ({ vote, count }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Voting Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Story Label Input */}
          <div className="mb-8">
            <input
              type="text"
              value={currentStory.label}
              onChange={(e) => isAdmin && updateStoryLabel(e.target.value)}
              placeholder="Enter story name or ticket number (optional)..."
              readOnly={!isAdmin}
              className={`w-full text-2xl md:text-3xl font-semibold p-4 rounded-lg border-2 ${
                isAdmin
                  ? 'border-gray-300 focus:border-blue-500 focus:outline-none'
                  : 'border-gray-200 bg-gray-50 cursor-default'
              }`}
            />
            {!isAdmin && (
              <p className="text-sm text-gray-500 mt-2">Only the admin can edit the story label</p>
            )}
          </div>

          {/* Voting Cards */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {currentStory.votesRevealed ? 'Votes Revealed' : 'Select Your Vote'}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
              {POKER_CARDS.map((card) => {
                const isSelected = currentUserVote === card;
                return (
                  <button
                    key={card}
                    onClick={() => handleVote(card)}
                    disabled={currentStory.votesRevealed}
                    className={`
                      aspect-[2/3] rounded-lg border-2 font-bold text-2xl transition-all
                      ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:shadow-md'
                      }
                      ${currentStory.votesRevealed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {card}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voting Status */}
          <div className="mb-8">
            <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
              <span className="text-gray-700 font-medium">
                {votedCount}/{totalCount} voted
              </span>
              <div className="flex gap-1">
                {participants.map((p) => (
                  <div
                    key={p.userId}
                    className={`w-3 h-3 rounded-full ${
                      p.hasVoted ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    title={`${p.name}${p.hasVoted ? ' - Voted' : ' - Pending'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Results (shown after reveal) */}
          {currentStory.votesRevealed && (
            <div className="mb-8 bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Results</h3>

              {/* Consensus Vote */}
              {currentStory.consensusVote !== null && (
                <div className="mb-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Most Common Vote</p>
                  <div className="inline-block bg-green-500 text-white rounded-lg px-8 py-4">
                    <span className="text-4xl font-bold">{currentStory.consensusVote}</span>
                  </div>
                </div>
              )}

              {/* Vote Distribution */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-3">Vote Distribution:</p>
                {getVoteDistribution().map(({ vote, count }) => (
                  <div key={vote} className="flex items-center gap-3">
                    <div className="w-12 h-12 border-2 border-gray-300 rounded flex items-center justify-center font-bold">
                      {vote}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                      <div
                        className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${(count / totalCount) * 100}%` }}
                      >
                        <span className="text-white font-semibold text-sm">
                          {count} {count === 1 ? 'vote' : 'votes'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Individual Votes */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Individual Votes:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {participants
                    .filter(p => p.vote !== null)
                    .map(p => (
                      <div key={p.userId} className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                          style={{ backgroundColor: p.avatarColor || '#6B7280' }}
                        >
                          {p.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700">{p.name}</span>
                        <span className="ml-auto font-semibold text-blue-600">{p.vote}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex flex-wrap gap-3">
              {!currentStory.votesRevealed ? (
                <>
                  <button
                    onClick={revealVotes}
                    disabled={votedCount === 0}
                    className="flex-1 min-w-[200px] py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors"
                  >
                    Reveal Votes
                  </button>
                  <button
                    onClick={resetVotes}
                    className="py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition-colors"
                  >
                    Reset Current
                  </button>
                </>
              ) : (
                <button
                  onClick={nextStory}
                  className="flex-1 min-w-[200px] py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Next Story
                </button>
              )}
            </div>
          )}

          {!isAdmin && (
            <p className="text-sm text-gray-500 text-center">
              Waiting for admin to reveal votes...
            </p>
          )}
        </div>
      </div>

      {/* History Bar */}
      {history.length > 0 && (
        <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Story History</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-gray-50 border border-gray-200 rounded-lg p-3 min-w-[200px] cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    const details = `
Story: ${item.storyLabel || 'Unnamed'}
Consensus: ${item.consensusVote} points
Votes: ${item.votes.map(v => `${v.userName}: ${v.vote}`).join(', ')}
Time: ${new Date(item.timestamp).toLocaleTimeString()}
                    `.trim();
                    alert(details);
                  }}
                >
                  <div className="font-semibold text-gray-900 truncate mb-1">
                    {item.storyLabel || 'Unnamed Story'}
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {item.consensusVote} {typeof item.consensusVote === 'number' && item.consensusVote !== 1 ? 'points' : 'point'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
