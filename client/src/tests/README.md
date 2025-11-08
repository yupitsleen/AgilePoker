# Tests Directory

This directory contains all automated tests for the AgilePoker application.

## Current Test Coverage

- **36 passing tests** across 2 test files
- **23 unit tests** for state management (roomStore)
- **13 component tests** for UI components (Sidebar)

## Structure

```
tests/
├── setup.ts              # Global test configuration & mocks
├── stores/               # State management tests
│   └── roomStore.test.ts # Zustand store tests (23 tests)
└── components/           # Component tests
    └── Sidebar.test.tsx  # Sidebar component tests (13 tests)
```

## Running Tests

```bash
# Watch mode (recommended for development)
npm test

# Run once
npm run test:run

# With UI
npm run test:ui

# With coverage
npm run test:coverage
```

## Adding New Tests

### For Store Tests

1. Create or open `stores/<storeName>.test.ts`
2. Follow the pattern in `roomStore.test.ts`
3. Focus on testing state transitions and business logic

Example:
```typescript
describe('MyStore', () => {
  beforeEach(() => {
    // Reset state
    useMyStore.setState({ /* initial state */ });
  });

  it('should do something valuable', () => {
    const { myAction } = useMyStore.getState();

    myAction(params);

    const state = useMyStore.getState();
    expect(state.result).toBe(expected);
  });
});
```

### For Component Tests

1. Create or open `components/<ComponentName>.test.tsx`
2. Follow the pattern in `Sidebar.test.tsx`
3. Focus on what users see and interact with

Example:
```typescript
describe('MyComponent', () => {
  it('should display expected content', () => {
    render(<MyComponent />);

    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

## Best Practices

✅ **DO:**
- Test user-visible behavior
- Use semantic queries (`getByRole`, `getByText`, `getByLabelText`)
- Reset state between tests
- Keep tests simple and readable
- Test one thing per test

❌ **DON'T:**
- Test implementation details
- Use brittle selectors (CSS classes, test IDs)
- Mock everything
- Write snapshot tests
- Make tests dependent on each other

## Documentation

For comprehensive testing guidelines, see:
- [TESTING.md](../TESTING.md) - Full testing guide with examples
- [TESTING_SUMMARY.md](../../../TESTING_SUMMARY.md) - Overview of test infrastructure

## Questions?

If you're unsure how to test something:
1. Ask: "What would a user do?"
2. Write the test based on user behavior
3. Focus on outcomes, not implementation
4. Keep it simple and readable
