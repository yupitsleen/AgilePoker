// User and Participant Types
export interface User {
  userId: string;
  name: string;
  avatarColor?: string;
}

export interface Participant extends User {
  vote: number | string | null;
  hasVoted: boolean;
  isActive: boolean;
  lastSeen: number;
}

// Planning Poker Types
export interface StoryVote {
  userId: string;
  userName: string;
  vote: number | string;
}

export interface StoryHistory {
  storyLabel: string;
  consensusVote: number | string;
  votes: StoryVote[];
  timestamp: number;
}

export interface CurrentStory {
  label: string;
  votesRevealed: boolean;
  consensusVote: number | string | null;
}

export interface PokerRoom {
  roomId: string;
  adminUserId: string;
  currentStory: CurrentStory;
  participants: Participant[];
  history: StoryHistory[];
  createdAt: number;
}

// Triangle Types
export interface TriangleCorner {
  label: string;
  selected: boolean;
}

export interface TriangleCorners {
  top: TriangleCorner;
  bottomLeft: TriangleCorner;
  bottomRight: TriangleCorner;
}

export type TriangleMode = 'standard' | 'voting';

export interface TriangleVote {
  userId: string;
  userName: string;
  selection: string; // e.g., "Fast + Quality"
}

export interface TriangleVotingState {
  votesRevealed: boolean;
  votes: TriangleVote[];
  consensusSelection: string | null;
}

export interface TriangleState {
  corners: TriangleCorners;
  mode: TriangleMode;
  votingState: TriangleVotingState | null;
}

// Room Types
export interface Room {
  roomId: string;
  adminUserId: string;
  participants: Participant[];
  pokerState?: PokerRoom;
  triangleState?: TriangleState;
  createdAt: number;
}

// WebSocket Event Types
export type SocketEvent =
  | 'room:created'
  | 'room:joined'
  | 'room:left'
  | 'room:updated'
  | 'participant:joined'
  | 'participant:left'
  | 'participant:updated'
  | 'poker:vote'
  | 'poker:reveal'
  | 'poker:next'
  | 'poker:reset'
  | 'poker:story-updated'
  | 'triangle:select'
  | 'triangle:label-updated'
  | 'triangle:vote'
  | 'triangle:reveal'
  | 'error';

// Card values for planning poker
export const POKER_CARDS = [0, 0.5, 1, 2, 3, 5, 8, 13, 21, '?', '☕'] as const;
export type PokerCard = typeof POKER_CARDS[number];

// Triangle combinations
export const TRIANGLE_COMBINATIONS = [
  'Fast + Quality',
  'Fast + Cheap',
  'Quality + Cheap'
] as const;
export type TriangleCombination = typeof TRIANGLE_COMBINATIONS[number];
