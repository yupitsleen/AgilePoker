# Planning Poker & Project Triangle App - Specification

## Overview

A responsive web application for agile software development teams featuring collaborative story pointing and project priority visualization.

## Tech Stack Recommendations

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS (responsive design)
- **Real-time Communication**: WebSocket (Socket.io) or Firebase Realtime Database
- **State Management**: React Context or Zustand
- **Routing**: React Router
- **Image Export**: html2canvas

---

## Global Layout Structure

### Sidebar - Participant List (All Pages)

**Desktop (>768px)**

- Fixed right sidebar (250-300px width)
- Always visible on both Planning Poker and Project Triangle pages
- Scrollable if participant list exceeds viewport height

**Mobile (<768px)**

- Collapsible drawer or floating button with participant count badge
- Slides in from right when opened
- Overlay with backdrop blur when open

**Sidebar Content**

- **Header**: "In Room" with participant count (e.g., "5 participants")
- **Room Code**: Display current room code with copy button
- **Participant List**:
  - Avatar/initials circle with background color
  - Display name
  - Status indicator (green dot = active, gray = idle/disconnected)
  - Admin badge/crown icon for room host
  - "You" label for current user
- **Footer Actions**:
  - "Invite" button (copies room link)
  - "Leave Room" button (red/secondary)

**Real-time Updates**

- Participants appear/disappear instantly
- Smooth animations for join/leave events
- Toast notification: "{Name} joined the room" / "{Name} left the room"

---

## Feature 1: Planning Poker (Story Pointing)

### Core Functionality

**Story Label Input**

- **Location**: Prominent text input at top of voting area (above cards)
- **Placeholder**: "Enter story name or ticket number (optional)..."
- **Behavior**:
  - Admin can edit at any time
  - Syncs in real-time to all participants
  - Displays read-only for non-admin users
  - Saves with voting results when "Next" is pressed
- **Display**: Large, clear font (h2/h3 size) for easy reading
- **Mobile**: Full width, auto-focus when board loads (optional)

**Room System**

- Users can create or join rooms via unique room codes/URLs
- Room state persists during active session
- Sidebar shows all active participants in real-time

**Voting Interface**

- Fibonacci sequence cards: 1, 2, 3, 5, 8, 13, 21 (standard story points)
- Optional: Include 0, ½, ?, and ☕ (coffee break) cards
- Cards displayed as clickable tiles in a grid layout
- Selected card highlights visually but remains hidden to others

**Voting Status Indicators**

- In sidebar: Show checkmark or indicator next to participants who have voted
- Bottom of voting area: "3/5 voted" counter
- Participants who haven't voted have a subtle pending indicator

**Admin Controls**

- First user to join becomes room admin (host)
- Crown/star icon in sidebar next to admin name
- Admin-only buttons:
  - **"Reveal Votes"**: Shows all votes for current story
  - **"Next Story"**: Saves current results, clears board, resets label
- Optional: Transfer admin rights to another participant

**Reveal & Results**

- On reveal: All cards flip simultaneously with animation
- Display voting summary:
  - Most common vote (mode) highlighted prominently at bottom
  - Show each participant's vote next to their name in sidebar
  - Display vote distribution (e.g., "3 votes for 5, 2 votes for 8")
- Average/median calculations (optional)
- Results remain visible until "Next Story" is pressed

**Next Story Workflow**

1. Admin clicks "Next Story" button (only visible after reveal)
2. Current story + consensus vote saved to history
3. Board resets:
   - All votes cleared
   - Story label cleared (ready for new input)
   - Cards return to face-down state
   - Vote indicators reset
4. Previous result appears in History Bar at bottom
5. All participants see fresh board simultaneously

**Reset Functionality**

- Separate "Reset Current" button (smaller, secondary style)
- Clears votes for current story without saving to history
- Keeps story label intact
- Use case: Revote on same story

### History Bar (Bottom of Screen)

**Location & Layout**

- Fixed bottom bar (above viewport edge)
- Horizontal scrollable row
- Height: 60-80px
- Background: Subtle contrast from main area
- Visible on Planning Poker page only

**Content**

- Each completed story shows as a card/tile:
  ```
  ┌─────────────────┐
  │ Story: USER-123 │
  │ Vote: 5 points  │
  └─────────────────┘
  ```
- Cards display left-to-right (newest on right)
- Horizontal scroll with scroll indicators
- Mobile: Swipeable cards
- No limit to number of stories saved

**Card Details**

- Story name/label (truncated if long, tooltip shows full)
- Consensus vote (the winning/most common vote)
- Timestamp (optional, on hover)
- Subtle border/shadow for separation

**Actions**

- Click card to see detailed voting breakdown (modal/popover):
  - All participants' votes
  - Vote distribution chart
  - Timestamp
- Optional: Delete/edit past story (admin only)
- Optional: Export history as CSV/JSON

**Persistence**

- History stored per room session
- Clears when all users leave (optional: persist for 24h)
- Option to download/export before leaving

### UI/UX Details

- Mobile-responsive card grid (2-3 columns on mobile, 4+ on desktop)
- Real-time participant counter (e.g., "5/5 voted")
- Toast notifications for room events (user joined, votes revealed, next story)
- Lobby/waiting screen before voting starts
- Clear visual hierarchy: Story Name → Voting Cards → Results → History

---

## Feature 2: Project Management Triangle

### Mode 1: Standard Selection Mode

**Triangle Visualization**

- Equilateral triangle with three corners
- Default corner labels: "Fast", "Quality", "Cheap"
- **Customizable labels**: Text inputs to rename each corner
- Sidebar remains visible showing all participants in room

**Selection Logic**

- Click to select 2 corners (maximum enforced)
- Cannot select all 3 corners
- Clicking a third corner deselects the first selected

**Visual Feedback**

- **Selected corners**: Green dots
- **Unselected corner**: Red dot
- **Edges between selected corners**: Green stroke
- **Edge connecting to unselected corner**: Red stroke
- Clean, modern styling with clear color contrast

**Export Functionality**

- Button: "Export as PNG" (and/or JPG)
- Captures triangle with current selection and labels
- Downloads image file with timestamp filename

### Mode 2: Voting Mode

**Functionality**

- Same real-time voting system as Planning Poker
- Instead of story point cards, users vote on which 2 corners to prioritize
- Options: "Fast + Quality", "Fast + Cheap", "Quality + Cheap"
- Admin reveals votes
- Display most voted combination
- Triangle updates to show winning selection

**Voting Status in Sidebar**

- Show checkmark next to participants who have voted
- "4/5 voted" counter displayed
- Admin can reveal when ready

**UI Elements**

- Toggle between "Standard Mode" and "Voting Mode"
- Sidebar shows participant status during voting
- Voting cards for three possible combinations
- Result display showing vote breakdown

### Shared Triangle Settings

- Label editing panel (visible in both modes)
- Color customization (optional advanced feature)
- Reset/clear selection button

---

## Global App Features

### Navigation

- Top navigation bar with app name
- Switch between "Planning Poker" and "Project Triangle" features
- User profile indicator (name/initials)
- Room code display (on mobile, since sidebar may be collapsed)

### User Setup

- On first visit: Prompt for display name
- Stored in localStorage for return visits
- Optional avatar upload or color assignment

### Room Management

- **Create Room**: Generates shareable link/code
- **Join Room**: Enter room code or click link
- **Leave Room**: Exit button in sidebar with confirmation
- Room expiration after inactivity (e.g., 24 hours)

### Responsive Design

- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Touch-friendly button sizes (minimum 44x44px)
- **Desktop**: Sidebar fixed right, main content uses remaining space
- **Mobile**: Collapsible sidebar with floating toggle button

---

## Layout Structure

### Desktop Layout - Planning Poker (>768px)

```
┌─────────────────────────────────────────────────────────┐
│ Top Navigation Bar                                      │
├───────────────────────────────────┬─────────────────────┤
│ ┌───────────────────────────────┐ │  SIDEBAR            │
│ │ Story: USER-123 (admin edits) │ │  ┌───────────────┐  │
│ └───────────────────────────────┘ │  │ In Room (5)   │  │
│                                   │  ├───────────────┤  │
│   Voting Cards (1,2,3,5,8...)     │  │ 👑 Alice ✓    │  │
│   [  ]  [  ]  [  ]  [  ]          │  │    Bob   ✓    │  │
│                                   │  │    Carol      │  │
│   3/5 voted                       │  │ You: Dave ✓   │  │
│                                   │  │    Eve   ✓    │  │
│   [Reveal] [Next Story] (admin)   │  └───────────────┘  │
│                                   │  [Invite]           │
├───────────────────────────────────┤  [Leave Room]       │
│ HISTORY BAR                       │                     │
│ [Story A: 3pts] [Story B: 5pts]   │                     │
│ ← ─────────────────────────────→  │                     │
└───────────────────────────────────┴─────────────────────┘
```

### Mobile Layout (<768px)

```
┌─────────────────────────────────┐
│ Top Nav Bar      [👥 5] [≡]     │
├─────────────────────────────────┤
│ Story: USER-123                 │
├─────────────────────────────────┤
│   Voting Cards                  │
│   [1] [2] [3]                   │
│   [5] [8] [13]                  │
│                                 │
│   3/5 voted                     │
│   [Reveal] [Next]               │
├─────────────────────────────────┤
│ History: [A:3] [B:5] [C:8] →    │
└─────────────────────────────────┘
```

---

## Data Structure Examples

### Planning Poker Room State

```typescript
{
  roomId: string,
  adminUserId: string,
  currentStory: {
    label: string,
    votesRevealed: boolean,
    consensusVote: number | null
  },
  participants: [
    {
      userId: string,
      name: string,
      vote: number | null,
      hasVoted: boolean,
      isActive: boolean,
      lastSeen: timestamp
    }
  ],
  history: [
    {
      storyLabel: string,
      consensusVote: number,
      votes: { userId: string, vote: number }[],
      timestamp: timestamp
    }
  ],
  createdAt: timestamp
}
```

### Triangle State

```typescript
{
  corners: {
    top: { label: string, selected: boolean },
    bottomLeft: { label: string, selected: boolean },
    bottomRight: { label: string, selected: boolean }
  },
  mode: 'standard' | 'voting',
  votingState: { /* similar to poker room */ }
}
```

---

## Implementation Priorities

### Phase 1 (MVP)

1. Room system with persistent sidebar
2. Planning Poker with:
   - Story label input
   - Basic voting
   - Reveal functionality
   - "Next Story" button
   - History bar (basic version)
3. Standard triangle selection with export
4. Basic responsive layout with collapsible sidebar

### Phase 2 (Enhanced)

1. Triangle voting mode
2. Real-time participant status updates in sidebar
3. Enhanced history bar with details modal
4. Export history functionality

### Phase 3 (Polish)

1. Custom triangle styling
2. Vote history analytics/charts
3. Admin controls refinement
4. Participant presence indicators
5. History persistence options

---

## Technical Considerations

**Real-time Sync**

- Use WebSocket for instant updates across clients
- Handle reconnection gracefully
- Display connection status indicator in sidebar
- Update participant list in real-time
- Sync story label edits instantly
- Broadcast "Next Story" action to all participants

**History Management**

- Store history array in room state
- Limit to last 50 stories (or unlimited with pagination)
- Efficient rendering for long history bars (virtualization)
- LocalStorage backup (optional)

**Sidebar State Management**

- Persist sidebar open/closed preference (localStorage)
- Smooth animations for mobile drawer
- Auto-close on mobile after selecting actions (optional)

**Security**

- Room codes: 6-character alphanumeric
- No sensitive data storage
- Optional: Password-protected rooms

**Performance**

- Lazy load features (code splitting)
- Optimize image export for mobile
- Cache user preferences locally
- Efficient real-time listener management for participant updates
- Virtual scrolling for history bar if >20 items

---

## User Flow Example

**Typical Planning Poker Session:**

1. User creates room, becomes admin
2. Shares room code with team
3. Team joins, appears in sidebar
4. Admin types story name: "USER-123: Login page bug"
5. Team votes (checkmarks appear in sidebar)
6. Admin clicks "Reveal" → votes shown
7. Consensus: 5 points (displayed prominently)
8. Admin clicks "Next Story"
9. "USER-123: 5pts" appears in history bar
10. Board resets, story label cleared
11. Process repeats for next story
12. History bar grows with each completed story
13. Click history card to see vote details
14. Export/download history before leaving (optional)
