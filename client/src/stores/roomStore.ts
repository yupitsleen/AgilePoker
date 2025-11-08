import { create } from 'zustand';
import type { User, Participant, Room, StoryHistory, PokerCard } from '../types';

interface RoomState {
  currentUser: User | null;
  room: Room | null;
  currentPage: 'poker' | 'triangle';

  // User actions
  setCurrentUser: (user: User) => void;

  // Room actions
  createRoom: () => string;
  joinRoom: (roomId: string, user: User) => void;
  leaveRoom: () => void;

  // Poker actions
  updateStoryLabel: (label: string) => void;
  submitVote: (vote: PokerCard) => void;
  revealVotes: () => void;
  nextStory: () => void;
  resetVotes: () => void;

  // Navigation
  setCurrentPage: (page: 'poker' | 'triangle') => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const generateRoomId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getAvatarColor = (): string => {
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const calculateConsensus = (participants: Participant[]): number | string | null => {
  const votes = participants
    .filter(p => p.vote !== null)
    .map(p => p.vote!);

  if (votes.length === 0) return null;

  // Count votes
  const voteCounts = new Map<number | string, number>();
  votes.forEach(vote => {
    voteCounts.set(vote, (voteCounts.get(vote) || 0) + 1);
  });

  // Find most common vote
  let maxCount = 0;
  let consensus: number | string | null = null;
  voteCounts.forEach((count, vote) => {
    if (count > maxCount) {
      maxCount = count;
      consensus = vote;
    }
  });

  return consensus;
};

export const useRoomStore = create<RoomState>((set, get) => ({
  currentUser: null,
  room: null,
  currentPage: 'poker',
  sidebarOpen: window.innerWidth >= 768, // Open by default on desktop

  setCurrentUser: (user: User) => {
    set({ currentUser: user });
  },

  createRoom: () => {
    const roomId = generateRoomId();
    const currentUser = get().currentUser;

    if (!currentUser) {
      throw new Error('User must be set before creating a room');
    }

    const participant: Participant = {
      ...currentUser,
      vote: null,
      hasVoted: false,
      isActive: true,
      lastSeen: Date.now(),
    };

    const room: Room = {
      roomId,
      adminUserId: currentUser.userId,
      participants: [participant],
      pokerState: {
        roomId,
        adminUserId: currentUser.userId,
        currentStory: {
          label: '',
          votesRevealed: false,
          consensusVote: null,
        },
        participants: [participant],
        history: [],
        createdAt: Date.now(),
      },
      triangleState: {
        corners: {
          top: { label: 'Fast', selected: false },
          bottomLeft: { label: 'Quality', selected: false },
          bottomRight: { label: 'Cheap', selected: false },
        },
        mode: 'standard',
        votingState: null,
      },
      createdAt: Date.now(),
    };

    set({ room });
    return roomId;
  },

  joinRoom: (roomId: string, user: User) => {
    // In a real implementation, this would fetch the room from the server
    // For now, we'll just create a new room
    const participant: Participant = {
      ...user,
      vote: null,
      hasVoted: false,
      isActive: true,
      lastSeen: Date.now(),
    };

    set((state) => {
      if (!state.room) {
        // Create new room if it doesn't exist
        const room: Room = {
          roomId,
          adminUserId: user.userId,
          participants: [participant],
          pokerState: {
            roomId,
            adminUserId: user.userId,
            currentStory: {
              label: '',
              votesRevealed: false,
              consensusVote: null,
            },
            participants: [participant],
            history: [],
            createdAt: Date.now(),
          },
          triangleState: {
            corners: {
              top: { label: 'Fast', selected: false },
              bottomLeft: { label: 'Quality', selected: false },
              bottomRight: { label: 'Cheap', selected: false },
            },
            mode: 'standard',
            votingState: null,
          },
          createdAt: Date.now(),
        };
        return { room };
      }

      // Add participant to existing room
      const updatedParticipants = [...state.room.participants, participant];
      return {
        room: {
          ...state.room,
          participants: updatedParticipants,
          pokerState: state.room.pokerState ? {
            ...state.room.pokerState,
            participants: updatedParticipants,
          } : undefined,
        },
      };
    });
  },

  leaveRoom: () => {
    set({ room: null });
  },

  updateStoryLabel: (label: string) => {
    set((state) => {
      if (!state.room?.pokerState) return state;

      return {
        room: {
          ...state.room,
          pokerState: {
            ...state.room.pokerState,
            currentStory: {
              ...state.room.pokerState.currentStory,
              label,
            },
          },
        },
      };
    });
  },

  submitVote: (vote: PokerCard) => {
    set((state) => {
      if (!state.room?.pokerState || !state.currentUser) return state;

      const updatedParticipants = state.room.pokerState.participants.map(p =>
        p.userId === state.currentUser!.userId
          ? { ...p, vote, hasVoted: true }
          : p
      );

      return {
        room: {
          ...state.room,
          participants: updatedParticipants,
          pokerState: {
            ...state.room.pokerState,
            participants: updatedParticipants,
          },
        },
      };
    });
  },

  revealVotes: () => {
    set((state) => {
      if (!state.room?.pokerState) return state;

      const consensus = calculateConsensus(state.room.pokerState.participants);

      return {
        room: {
          ...state.room,
          pokerState: {
            ...state.room.pokerState,
            currentStory: {
              ...state.room.pokerState.currentStory,
              votesRevealed: true,
              consensusVote: consensus,
            },
          },
        },
      };
    });
  },

  nextStory: () => {
    set((state) => {
      if (!state.room?.pokerState) return state;

      const { currentStory, participants, history } = state.room.pokerState;

      // Save current story to history
      const newHistoryItem: StoryHistory = {
        storyLabel: currentStory.label,
        consensusVote: currentStory.consensusVote || 0,
        votes: participants
          .filter(p => p.vote !== null)
          .map(p => ({
            userId: p.userId,
            userName: p.name,
            vote: p.vote!,
          })),
        timestamp: Date.now(),
      };

      // Reset participants' votes
      const resetParticipants = participants.map(p => ({
        ...p,
        vote: null,
        hasVoted: false,
      }));

      return {
        room: {
          ...state.room,
          participants: resetParticipants,
          pokerState: {
            ...state.room.pokerState,
            currentStory: {
              label: '',
              votesRevealed: false,
              consensusVote: null,
            },
            participants: resetParticipants,
            history: [...history, newHistoryItem],
          },
        },
      };
    });
  },

  resetVotes: () => {
    set((state) => {
      if (!state.room?.pokerState) return state;

      const resetParticipants = state.room.pokerState.participants.map(p => ({
        ...p,
        vote: null,
        hasVoted: false,
      }));

      return {
        room: {
          ...state.room,
          participants: resetParticipants,
          pokerState: {
            ...state.room.pokerState,
            currentStory: {
              ...state.room.pokerState.currentStory,
              votesRevealed: false,
              consensusVote: null,
            },
            participants: resetParticipants,
          },
        },
      };
    });
  },

  setCurrentPage: (page: 'poker' | 'triangle') => {
    set({ currentPage: page });
  },

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },
}));

// Utility function to get or create user
export const getOrCreateUser = (): User => {
  const stored = localStorage.getItem('agilepoker_user');
  if (stored) {
    return JSON.parse(stored);
  }

  const userName = prompt('Enter your name:');
  if (!userName) {
    return getOrCreateUser(); // Retry if no name provided
  }

  const user: User = {
    userId: generateUserId(),
    name: userName,
    avatarColor: getAvatarColor(),
  };

  localStorage.setItem('agilepoker_user', JSON.stringify(user));
  return user;
};
