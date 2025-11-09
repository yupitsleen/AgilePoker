# Testing Guide for AgilePoker

## Overview

This project uses a comprehensive testing strategy focused on providing **real value** while avoiding **brittle tests**. The testing infrastructure is built with:

- **Vitest** - Fast, modern test runner built for Vite projects
- **React Testing Library** - User-centric component testing
- **@testing-library/user-event** - Realistic user interactions
- **jsdom** - Browser environment simulation

## Testing Philosophy

Our testing approach follows these principles:

1. **Test Behavior, Not Implementation** - Focus on what users see and do, not internal code details
2. **Avoid Brittle Tests** - Don't test implementation details that may change
3. **Provide Real Value** - Each test should catch real bugs and prevent regressions
4. **Maintainable Tests** - Tests should be easy to understand and update

## Running Tests

### Basic Commands

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once (useful for CI/CD)
npm run test:run

# Run tests with UI interface
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Watch Mode

Watch mode automatically re-runs tests when you change files. This is the recommended mode for development:

```bash
npm test
```

Press `a` to run all tests, `f` to run only failed tests, or `q` to quit.

### Coverage Reports

Coverage reports show which parts of your code are tested:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory. Open `coverage/index.html` in a browser to view the interactive report.

## Test Organization

Tests are organized in the `src/tests/` directory:

```
src/tests/
├── setup.ts                    # Global test configuration
├── stores/
│   └── roomStore.test.ts      # Zustand store unit tests
├── components/
│   └── Sidebar.test.tsx       # Component tests
└── integration/
    └── userFlows.test.tsx     # End-to-end user flow tests
```

## Test Types

### 1. Unit Tests (State Management)

**Location:** `src/tests/stores/roomStore.test.ts`

**Purpose:** Test business logic in isolation

**What to test:**
- State transitions
- Action behaviors
- Edge cases and error handling
- Data transformations

**Example:**
```typescript
it('should submit vote for current user', () => {
  const { submitVote } = useRoomStore.getState();

  submitVote(5);

  const participant = useRoomStore.getState()
    .room?.pokerState?.participants[0];
  expect(participant?.vote).toBe(5);
  expect(participant?.hasVoted).toBe(true);
});
```

### 2. Component Tests

**Location:** `src/tests/components/*.test.tsx`

**Purpose:** Test component rendering and user interactions

**What to test:**
- Component renders correctly with different props
- User interactions (clicks, typing, etc.)
- Conditional rendering
- Accessibility features

**Example:**
```typescript
it('should copy room code to clipboard', async () => {
  const user = userEvent.setup();
  render(<Sidebar />);

  const copyButton = screen.getByRole('button', { name: /copy/i });
  await user.click(copyButton);

  expect(navigator.clipboard.writeText)
    .toHaveBeenCalledWith(roomId);
});
```

### 3. Integration Tests (User Flows)

**Location:** `src/tests/integration/userFlows.test.tsx`

**Purpose:** Test complete user journeys through the application

**What to test:**
- Multi-step workflows
- Component interactions
- State persistence across actions
- Real user scenarios

**Example:**
```typescript
it('should complete a full voting cycle', async () => {
  const user = userEvent.setup();
  render(<PlanningPoker />);

  // 1. Enter story name
  const storyInput = screen.getByPlaceholderText(/enter story name/i);
  await user.type(storyInput, 'User Authentication');

  // 2. Submit vote
  const card5 = screen.getByRole('button', { name: '5' });
  await user.click(card5);

  // 3. Reveal votes
  const revealButton = screen.getByRole('button', { name: /reveal/i });
  await user.click(revealButton);

  // 4. Verify results
  expect(screen.getByText(/most common vote/i)).toBeInTheDocument();
});
```

## Best Practices

### DO ✅

1. **Use Semantic Queries**
   ```typescript
   // Good - queries by role/label (what users see)
   screen.getByRole('button', { name: /create room/i })
   screen.getByPlaceholderText(/enter room code/i)
   screen.getByText(/waiting for admin/i)
   ```

2. **Test User Behavior**
   ```typescript
   // Good - tests what users do
   await user.click(button)
   await user.type(input, 'text')
   expect(screen.getByText('Success')).toBeInTheDocument()
   ```

3. **Use userEvent Over fireEvent**
   ```typescript
   // Good - realistic user interactions
   const user = userEvent.setup()
   await user.click(button)

   // Avoid - low-level DOM events
   fireEvent.click(button)
   ```

4. **Reset State Between Tests**
   ```typescript
   beforeEach(() => {
     useRoomStore.setState({
       currentUser: null,
       room: null,
     });
     localStorage.clear();
   });
   ```

5. **Test Accessibility**
   ```typescript
   // Good - ensures accessible markup
   const button = screen.getByRole('button', { name: /submit/i })
   expect(button).not.toBeDisabled()
   ```

### DON'T ❌

1. **Don't Test Implementation Details**
   ```typescript
   // Bad - testing internal state structure
   expect(component.state.internalCounter).toBe(5)

   // Good - test visible behavior
   expect(screen.getByText('Count: 5')).toBeInTheDocument()
   ```

2. **Don't Use Brittle Selectors**
   ```typescript
   // Bad - breaks if CSS changes
   container.querySelector('.button-class')

   // Good - semantic queries
   screen.getByRole('button', { name: /submit/i })
   ```

3. **Don't Test Third-Party Libraries**
   ```typescript
   // Bad - testing Zustand's create function
   it('should create store correctly', () => {
     expect(typeof useRoomStore).toBe('function')
   })

   // Good - test your business logic
   it('should update story label', () => {
     useRoomStore.getState().updateStoryLabel('New Story')
     expect(useRoomStore.getState().room.pokerState.currentStory.label)
       .toBe('New Story')
   })
   ```

4. **Don't Test Every Edge Case**
   ```typescript
   // Avoid over-testing trivial cases
   it('should render with empty string', () => {})
   it('should render with undefined', () => {})
   it('should render with null', () => {})

   // Focus on meaningful scenarios
   it('should handle missing room gracefully', () => {})
   ```

## Writing New Tests

### Template for Component Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YourComponent } from '../components/YourComponent';

describe('YourComponent', () => {
  beforeEach(() => {
    // Reset state, mocks, etc.
  });

  describe('Rendering', () => {
    it('should render correctly', () => {
      render(<YourComponent />);
      expect(screen.getByText(/expected text/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle user action', async () => {
      const user = userEvent.setup();
      render(<YourComponent />);

      const button = screen.getByRole('button', { name: /click me/i });
      await user.click(button);

      expect(screen.getByText(/result/i)).toBeInTheDocument();
    });
  });
});
```

### Template for Integration Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRoomStore } from '../stores/roomStore';

describe('User Flow - Feature Name', () => {
  beforeEach(() => {
    useRoomStore.setState({ /* reset state */ });
  });

  it('should complete [specific user journey]', async () => {
    const user = userEvent.setup();
    render(<YourPage />);

    // Step 1
    const input = screen.getByPlaceholderText(/enter something/i);
    await user.type(input, 'test value');

    // Step 2
    const button = screen.getByRole('button', { name: /submit/i });
    await user.click(button);

    // Assert final state
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

## Debugging Tests

### View Test UI

The Vitest UI provides a visual interface for debugging:

```bash
npm run test:ui
```

This opens a browser interface where you can:
- See which tests pass/fail
- View test output and errors
- Re-run specific tests
- Inspect component snapshots

### Common Issues

**Issue: "Cannot find element"**
```typescript
// Use screen.debug() to see current DOM
screen.debug()

// Or debug specific element
screen.debug(screen.getByRole('button'))
```

**Issue: "Element is not clickable"**
```typescript
// Wait for element to be ready
await waitFor(() => {
  expect(screen.getByRole('button')).not.toBeDisabled()
})
```

**Issue: "State not updating"**
```typescript
// Wrap in waitFor for async updates
await waitFor(() => {
  expect(screen.getByText(/updated text/i)).toBeInTheDocument()
})
```

## Mocking

### localStorage

Already mocked in `src/tests/setup.ts`. Use it naturally in tests:

```typescript
localStorage.setItem('key', 'value')
expect(localStorage.getItem('key')).toBe('value')
```

### navigator.clipboard

Mock in individual tests:

```typescript
beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
});
```

### window.prompt / window.alert / window.confirm

Mock as needed:

```typescript
vi.spyOn(window, 'prompt').mockReturnValue('User Name')
vi.spyOn(window, 'alert').mockImplementation(() => {})
vi.spyOn(window, 'confirm').mockReturnValue(true)
```

## CI/CD Integration

For continuous integration, add this to your pipeline:

```yaml
# Example for GitHub Actions
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage
```

## Coverage Goals

We aim for:
- **Store logic:** 90%+ coverage
- **Components:** 80%+ coverage
- **Integration flows:** Key user paths covered

Coverage is a guide, not a goal. Focus on testing **meaningful behavior** over hitting arbitrary percentages.

## Tips for Maintaining Tests

1. **Update tests when behavior changes** - If the UI or UX changes, update tests to reflect new behavior
2. **Keep tests simple** - Complex tests are hard to maintain and understand
3. **Run tests before commits** - Catch issues early
4. **Review test failures carefully** - Failures indicate either bugs or outdated tests
5. **Refactor tests like code** - Extract helpers, reduce duplication

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [User Event Documentation](https://testing-library.com/docs/user-event/intro)

## Questions?

If you're unsure how to test something:
1. Ask: "What would a user do?"
2. Write the test based on user behavior
3. Focus on outcomes, not implementation
4. Keep it simple and readable
