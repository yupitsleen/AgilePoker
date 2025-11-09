import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../../components/layout/Sidebar';
import { useRoomStore } from '../../stores/roomStore';
import type { User } from '../../types';

describe('Sidebar Component', () => {
  const mockUser: User = {
    userId: 'user-1',
    name: 'Test User',
    avatarColor: '#EF4444',
  };

  beforeEach(() => {
    useRoomStore.setState({
      currentUser: null,
      room: null,
      currentPage: 'poker',
      sidebarOpen: true,
    });
  });

  describe('Rendering', () => {
    it('should not render when no room exists', () => {
      const { container } = render(<Sidebar />);
      expect(container.firstChild).toBeNull();
    });

    it('should render when room exists', () => {
      useRoomStore.getState().setCurrentUser(mockUser);
      useRoomStore.getState().createRoom();

      render(<Sidebar />);

      expect(screen.getByText(/in room/i)).toBeInTheDocument();
    });

    it('should display correct participant count', () => {
      useRoomStore.getState().setCurrentUser(mockUser);
      useRoomStore.getState().createRoom();

      render(<Sidebar />);

      expect(screen.getByText(/in room \(1\)/i)).toBeInTheDocument();
    });

    it('should display room code', () => {
      useRoomStore.getState().setCurrentUser(mockUser);
      const roomId = useRoomStore.getState().createRoom();

      render(<Sidebar />);

      expect(screen.getByText(roomId)).toBeInTheDocument();
    });
  });

  describe('Participant List', () => {
    beforeEach(() => {
      useRoomStore.getState().setCurrentUser(mockUser);
      useRoomStore.getState().createRoom();
    });

    it('should display participant name', () => {
      render(<Sidebar />);

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });

    it('should show avatar with initials', () => {
      render(<Sidebar />);

      const avatar = screen.getByText('TE'); // First 2 letters of "Test User"
      expect(avatar).toBeInTheDocument();
    });

    it('should mark current user with "You" label', () => {
      render(<Sidebar />);

      expect(screen.getByText('(You)')).toBeInTheDocument();
    });

    it('should show admin badge for room admin', () => {
      render(<Sidebar />);

      const adminBadge = screen.getByTitle('Admin');
      expect(adminBadge).toBeInTheDocument();
      expect(adminBadge).toHaveTextContent('👑');
    });

    it('should show voted checkmark when participant has voted', () => {
      // Submit a vote
      useRoomStore.getState().submitVote(5);

      render(<Sidebar />);

      const votedIndicator = screen.getByTitle('Voted');
      expect(votedIndicator).toBeInTheDocument();
      expect(votedIndicator).toHaveTextContent('✓');
    });

    it('should display multiple participants', () => {
      const secondUser: User = {
        userId: 'user-2',
        name: 'Second User',
        avatarColor: '#10B981',
      };

      useRoomStore.getState().joinRoom('TEST123', secondUser);

      render(<Sidebar />);

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(secondUser.name)).toBeInTheDocument();
    });

    it('should show active status indicator', () => {
      render(<Sidebar />);

      const activeIndicator = screen.getByTitle('Active');
      expect(activeIndicator).toBeInTheDocument();
      expect(activeIndicator).toHaveClass('bg-green-500');
    });
  });

  describe('Multiple Participants Display', () => {
    it('should show different admin and non-admin users correctly', () => {
      useRoomStore.getState().setCurrentUser(mockUser);
      useRoomStore.getState().createRoom();

      const secondUser: User = {
        userId: 'user-2',
        name: 'Regular User',
        avatarColor: '#10B981',
      };

      useRoomStore.getState().joinRoom('TEST123', secondUser);

      render(<Sidebar />);

      // Admin should have crown
      const adminBadges = screen.getAllByTitle('Admin');
      expect(adminBadges).toHaveLength(1);

      // Should show both users
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(secondUser.name)).toBeInTheDocument();

      // Participant count should be 2
      expect(screen.getByText(/in room \(2\)/i)).toBeInTheDocument();
    });

    it('should show vote status for each participant', () => {
      useRoomStore.getState().setCurrentUser(mockUser);
      useRoomStore.getState().createRoom();

      const secondUser: User = {
        userId: 'user-2',
        name: 'Second User',
        avatarColor: '#10B981',
      };

      useRoomStore.getState().joinRoom('TEST123', secondUser);

      // First user votes
      useRoomStore.getState().submitVote(5);

      render(<Sidebar />);

      // Should show one voted checkmark
      const votedIndicators = screen.getAllByTitle('Voted');
      expect(votedIndicators).toHaveLength(1);
    });
  });
});
