import { describe, it, expect, beforeEach } from 'vitest';
import { useRoomStore } from '../../stores/roomStore';
import type { User, PokerCard } from '../../types';

describe('roomStore', () => {
  // Helper to reset store state between tests
  beforeEach(() => {
    useRoomStore.setState({
      currentUser: null,
      room: null,
      currentPage: 'poker',
      sidebarOpen: false,
    });
    localStorage.clear();
  });

  const mockUser: User = {
    userId: 'test-user-1',
    name: 'Test User',
    avatarColor: '#EF4444',
  };

  describe('User Management', () => {
    it('should set current user', () => {
      const { setCurrentUser } = useRoomStore.getState();

      setCurrentUser(mockUser);

      expect(useRoomStore.getState().currentUser).toEqual(mockUser);
    });
  });

  describe('Room Creation', () => {
    it('should create a room with valid room ID', () => {
      const { setCurrentUser, createRoom } = useRoomStore.getState();

      setCurrentUser(mockUser);
      const roomId = createRoom();

      expect(roomId).toBeDefined();
      expect(roomId).toHaveLength(6);
      expect(roomId).toMatch(/^[A-Z0-9]{6}$/);
    });

    it('should create room with current user as admin', () => {
      const { setCurrentUser, createRoom } = useRoomStore.getState();

      setCurrentUser(mockUser);
      createRoom();

      const { room } = useRoomStore.getState();
      expect(room?.adminUserId).toBe(mockUser.userId);
      expect(room?.participants).toHaveLength(1);
      expect(room?.participants[0].userId).toBe(mockUser.userId);
    });

    it('should throw error if user not set before creating room', () => {
      const { createRoom } = useRoomStore.getState();

      expect(() => createRoom()).toThrow('User must be set before creating a room');
    });

    it('should initialize poker state correctly', () => {
      const { setCurrentUser, createRoom } = useRoomStore.getState();

      setCurrentUser(mockUser);
      createRoom();

      const { room } = useRoomStore.getState();
      expect(room?.pokerState).toBeDefined();
      expect(room?.pokerState?.currentStory).toEqual({
        label: '',
        votesRevealed: false,
        consensusVote: null,
      });
      expect(room?.pokerState?.history).toEqual([]);
    });

    it('should initialize triangle state correctly', () => {
      const { setCurrentUser, createRoom } = useRoomStore.getState();

      setCurrentUser(mockUser);
      createRoom();

      const { room } = useRoomStore.getState();
      expect(room?.triangleState).toBeDefined();
      expect(room?.triangleState?.corners.top.label).toBe('Fast');
      expect(room?.triangleState?.corners.bottomLeft.label).toBe('Quality');
      expect(room?.triangleState?.corners.bottomRight.label).toBe('Cheap');
      expect(room?.triangleState?.corners.top.selected).toBe(false);
    });
  });

  describe('Room Joining', () => {
    it('should create new room if none exists', () => {
      const { joinRoom } = useRoomStore.getState();

      joinRoom('ABC123', mockUser);

      const { room } = useRoomStore.getState();
      expect(room?.roomId).toBe('ABC123');
      expect(room?.participants).toHaveLength(1);
    });

    it('should add participant to existing room', () => {
      const { setCurrentUser, createRoom, joinRoom } = useRoomStore.getState();

      setCurrentUser(mockUser);
      createRoom();

      const secondUser: User = {
        userId: 'test-user-2',
        name: 'Second User',
        avatarColor: '#10B981',
      };

      joinRoom('existing-room', secondUser);

      const { room } = useRoomStore.getState();
      expect(room?.participants).toHaveLength(2);
      expect(room?.participants[1].userId).toBe(secondUser.userId);
    });
  });

  describe('Room Leaving', () => {
    it('should clear room state when leaving', () => {
      const { setCurrentUser, createRoom, leaveRoom } = useRoomStore.getState();

      setCurrentUser(mockUser);
      createRoom();
      expect(useRoomStore.getState().room).toBeDefined();

      leaveRoom();

      expect(useRoomStore.getState().room).toBeNull();
    });
  });

  describe('Planning Poker - Story Management', () => {
    beforeEach(() => {
      useRoomStore.getState().setCurrentUser(mockUser);
      useRoomStore.getState().createRoom();
    });

    it('should update story label', () => {
      const { updateStoryLabel } = useRoomStore.getState();

      updateStoryLabel('Implement user authentication');

      const { room } = useRoomStore.getState();
      expect(room?.pokerState?.currentStory.label).toBe('Implement user authentication');
    });

    it('should not update story if no room exists', () => {
      useRoomStore.getState().leaveRoom();
      const { updateStoryLabel } = useRoomStore.getState();

      updateStoryLabel('Test story');

      const { room } = useRoomStore.getState();
      expect(room).toBeNull();
    });
  });

  describe('Planning Poker - Voting', () => {
    beforeEach(() => {
      useRoomStore.getState().setCurrentUser(mockUser);
      useRoomStore.getState().createRoom();
    });

    it('should submit vote for current user', () => {
      const { submitVote } = useRoomStore.getState();

      submitVote(5 as PokerCard);

      const { room } = useRoomStore.getState();
      const participant = room?.pokerState?.participants.find(p => p.userId === mockUser.userId);
      expect(participant?.vote).toBe(5);
      expect(participant?.hasVoted).toBe(true);
    });

    it('should allow changing vote before reveal', () => {
      const { submitVote } = useRoomStore.getState();

      submitVote(3 as PokerCard);
      submitVote(8 as PokerCard);

      const { room } = useRoomStore.getState();
      const participant = room?.pokerState?.participants.find(p => p.userId === mockUser.userId);
      expect(participant?.vote).toBe(8);
    });

    it('should handle special votes (? and coffee)', () => {
      const { submitVote } = useRoomStore.getState();

      submitVote('?' as PokerCard);

      const { room } = useRoomStore.getState();
      const participant = room?.pokerState?.participants.find(p => p.userId === mockUser.userId);
      expect(participant?.vote).toBe('?');
    });
  });

  describe('Planning Poker - Vote Reveal', () => {
    beforeEach(() => {
      useRoomStore.getState().setCurrentUser(mockUser);
      useRoomStore.getState().createRoom();
    });

    it('should reveal votes and calculate consensus', () => {
      const { submitVote, revealVotes } = useRoomStore.getState();

      submitVote(5 as PokerCard);
      revealVotes();

      const { room } = useRoomStore.getState();
      expect(room?.pokerState?.currentStory.votesRevealed).toBe(true);
      expect(room?.pokerState?.currentStory.consensusVote).toBe(5);
    });

    it('should calculate consensus with multiple voters', () => {
      const { joinRoom, submitVote, revealVotes } = useRoomStore.getState();

      // Add more participants and simulate votes
      submitVote(5 as PokerCard);

      const secondUser: User = { userId: 'user-2', name: 'User 2', avatarColor: '#000' };
      joinRoom('room', secondUser);

      // Manually set vote for second user (simulating their vote)
      useRoomStore.setState((state) => ({
        room: state.room ? {
          ...state.room,
          pokerState: state.room.pokerState ? {
            ...state.room.pokerState,
            participants: state.room.pokerState.participants.map(p =>
              p.userId === secondUser.userId ? { ...p, vote: 5, hasVoted: true } : p
            ),
          } : undefined,
        } : null,
      }));

      revealVotes();

      const { room } = useRoomStore.getState();
      expect(room?.pokerState?.currentStory.consensusVote).toBe(5);
    });

    it('should handle no votes scenario', () => {
      const { revealVotes } = useRoomStore.getState();

      revealVotes();

      const { room } = useRoomStore.getState();
      expect(room?.pokerState?.currentStory.votesRevealed).toBe(true);
      expect(room?.pokerState?.currentStory.consensusVote).toBeNull();
    });
  });

  describe('Planning Poker - Next Story', () => {
    beforeEach(() => {
      useRoomStore.getState().setCurrentUser(mockUser);
      useRoomStore.getState().createRoom();
    });

    it('should save story to history and reset for next story', () => {
      const { updateStoryLabel, submitVote, revealVotes, nextStory } = useRoomStore.getState();

      updateStoryLabel('User Authentication');
      submitVote(5 as PokerCard);
      revealVotes();
      nextStory();

      const { room } = useRoomStore.getState();

      // Check history
      expect(room?.pokerState?.history).toHaveLength(1);
      expect(room?.pokerState?.history[0].storyLabel).toBe('User Authentication');
      expect(room?.pokerState?.history[0].consensusVote).toBe(5);

      // Check reset state
      expect(room?.pokerState?.currentStory.label).toBe('');
      expect(room?.pokerState?.currentStory.votesRevealed).toBe(false);
      expect(room?.pokerState?.currentStory.consensusVote).toBeNull();

      // Check participants reset
      const participant = room?.pokerState?.participants.find(p => p.userId === mockUser.userId);
      expect(participant?.vote).toBeNull();
      expect(participant?.hasVoted).toBe(false);
    });

    it('should preserve history across multiple stories', () => {
      const { updateStoryLabel, submitVote, revealVotes, nextStory } = useRoomStore.getState();

      // First story
      updateStoryLabel('Story 1');
      submitVote(3 as PokerCard);
      revealVotes();
      nextStory();

      // Second story
      updateStoryLabel('Story 2');
      submitVote(8 as PokerCard);
      revealVotes();
      nextStory();

      const { room } = useRoomStore.getState();
      expect(room?.pokerState?.history).toHaveLength(2);
      expect(room?.pokerState?.history[0].storyLabel).toBe('Story 1');
      expect(room?.pokerState?.history[1].storyLabel).toBe('Story 2');
    });
  });

  describe('Planning Poker - Reset Votes', () => {
    beforeEach(() => {
      useRoomStore.getState().setCurrentUser(mockUser);
      useRoomStore.getState().createRoom();
    });

    it('should reset votes without saving to history', () => {
      const { updateStoryLabel, submitVote, revealVotes, resetVotes } = useRoomStore.getState();

      updateStoryLabel('Test Story');
      submitVote(5 as PokerCard);
      revealVotes();

      const historyLengthBefore = useRoomStore.getState().room?.pokerState?.history.length || 0;

      resetVotes();

      const { room } = useRoomStore.getState();

      // History should not change
      expect(room?.pokerState?.history).toHaveLength(historyLengthBefore);

      // Story label should remain
      expect(room?.pokerState?.currentStory.label).toBe('Test Story');

      // Votes should be reset
      expect(room?.pokerState?.currentStory.votesRevealed).toBe(false);
      expect(room?.pokerState?.currentStory.consensusVote).toBeNull();

      const participant = room?.pokerState?.participants.find(p => p.userId === mockUser.userId);
      expect(participant?.vote).toBeNull();
      expect(participant?.hasVoted).toBe(false);
    });
  });

  describe('Navigation', () => {
    it('should set current page to poker', () => {
      const { setCurrentPage } = useRoomStore.getState();

      setCurrentPage('poker');

      expect(useRoomStore.getState().currentPage).toBe('poker');
    });

    it('should set current page to triangle', () => {
      const { setCurrentPage } = useRoomStore.getState();

      setCurrentPage('triangle');

      expect(useRoomStore.getState().currentPage).toBe('triangle');
    });
  });

  describe('Sidebar', () => {
    it('should toggle sidebar open state', () => {
      const { setSidebarOpen } = useRoomStore.getState();

      setSidebarOpen(true);
      expect(useRoomStore.getState().sidebarOpen).toBe(true);

      setSidebarOpen(false);
      expect(useRoomStore.getState().sidebarOpen).toBe(false);
    });
  });
});
