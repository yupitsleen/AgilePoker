# Claude Code Instructions for AgilePoker

## Project Overview

AgilePoker is a React-based web application for agile teams, featuring Planning Poker (story pointing) and a Project Management Triangle tool. The app uses client-side state management and is designed to be extended with real-time WebSocket functionality in the future.

## Important Rules

### Testing Requirements

**CRITICAL: All tests must be passing before committing.**

Before any commit:
1. Run `npm run test:run` in the `client/` directory
2. Verify all tests pass
3. Run `npm run lint` to ensure no linting errors
4. Run `npm run build` to verify production build succeeds

### Code Quality Standards

- **TypeScript**: Use strict mode, no `any` types unless absolutely necessary
- **Testing**: Follow non-brittle testing practices (test behavior, not implementation)
- **Linting**: Code must pass ESLint with zero warnings/errors
- **State Management**: All state goes through Zustand store actions

## Project Structure

```
AgilePoker/
├── client/                      # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/          # Layout components (Sidebar, Layout)
│   │   ├── pages/               # Main pages (Home, PlanningPoker, ProjectTriangle)
│   │   ├── stores/              # Zustand state management
│   │   │   └── roomStore.ts     # Main store (WELL TESTED - 23 tests)
│   │   ├── types/               # TypeScript type definitions
│   │   ├── tests/               # Test files
│   │   │   ├── setup.ts         # Global test configuration
│   │   │   ├── stores/          # Store unit tests
│   │   │   └── components/      # Component tests
│   │   └── utils/               # Utility functions (future)
│   ├── TESTING.md               # Comprehensive testing guide
│   └── package.json             # Dependencies and scripts
├── TESTING_SUMMARY.md           # High-level testing overview
└── .claude/                     # Claude Code configuration
```

## Technology Stack

- **React 19** with TypeScript (strict mode)
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **Zustand** for state management
- **Vitest** + React Testing Library for testing
- **ESLint** with TypeScript rules

## Development Workflow

### Making Changes

1. **Create a feature branch** off `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the patterns in existing code

3. **Write tests** for new functionality:
   - Store logic → `src/tests/stores/*.test.ts`
   - Components → `src/tests/components/*.test.tsx`
   - Follow patterns in existing tests

4. **Run quality checks**:
   ```bash
   cd client
   npm test              # Ensure tests pass
   npm run lint          # Check for linting errors
   npm run build         # Verify build succeeds
   ```

5. **Commit with descriptive message**:
   ```bash
   git add .
   git commit -m "Add feature: description

   - Detailed change 1
   - Detailed change 2

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

### Testing Guidelines

**Philosophy**: Write non-brittle tests that provide real value

✅ **DO:**
- Test user-visible behavior
- Use semantic queries (`getByRole`, `getByText`, `getByLabelText`)
- Reset state between tests
- Focus on what users see and do
- Keep tests simple and readable

❌ **DON'T:**
- Test implementation details
- Use brittle selectors (CSS classes, test IDs)
- Mock everything (only mock external dependencies)
- Write snapshot tests
- Test third-party library internals

**Example Test Pattern:**
```typescript
describe('MyFeature', () => {
  beforeEach(() => {
    // Reset state
    useRoomStore.setState({ /* clean state */ });
  });

  it('should do something valuable for users', () => {
    const { myAction } = useRoomStore.getState();

    myAction(params);

    expect(useRoomStore.getState().result).toBe(expected);
  });
});
```

See [client/TESTING.md](../client/TESTING.md) for comprehensive testing guide.

## State Management Patterns

All state lives in `stores/roomStore.ts`. When adding new features:

1. **Define state shape** in `RoomState` interface
2. **Create action functions** that modify state
3. **Update state immutably** using spread operators
4. **Write tests** for the new actions (see `roomStore.test.ts`)

Example:
```typescript
// In roomStore.ts
interface RoomState {
  myNewFeature: string | null;
  setMyNewFeature: (value: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  myNewFeature: null,

  setMyNewFeature: (value: string) => {
    set({ myNewFeature: value });
  },
}));
```

## Common Tasks

### Adding a New Component

1. Create component in appropriate directory (`components/` or `pages/`)
2. Use TypeScript with proper types
3. Follow existing component patterns (functional components with hooks)
4. Add tests in `tests/components/YourComponent.test.tsx`
5. Export from component file

### Adding a New Store Action

1. Add action to `RoomState` interface in `roomStore.ts`
2. Implement the action in the store
3. Write unit tests in `tests/stores/roomStore.test.ts`
4. Update components to use the new action

### Updating Styling

- Use Tailwind utility classes
- Follow responsive design patterns (mobile-first)
- Check both desktop (>768px) and mobile (<768px) views
- Maintain accessibility (proper ARIA labels, semantic HTML)

## File Naming Conventions

- **Components**: PascalCase (e.g., `Sidebar.tsx`, `PlanningPoker.tsx`)
- **Tests**: Match component name with `.test.tsx` or `.test.ts`
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase for interfaces/types (e.g., `User`, `PokerCard`)

## Future Phases

### Phase 2 (Planned)
- Real-time WebSocket support with Socket.io
- Triangle voting mode
- Enhanced history with charts

### Phase 3 (Planned)
- Room persistence (24h)
- Password-protected rooms
- Advanced analytics

**Note**: When implementing WebSocket features, the current types in `types/index.ts` already include WebSocket event definitions. The store is structured to easily integrate with Socket.io.

## Debugging

### Common Issues

**Tests failing after changes:**
- Check if you updated state shape without updating tests
- Ensure you're resetting state in `beforeEach`
- Use `screen.debug()` to see current DOM state

**Build errors:**
- Check TypeScript strict mode compliance
- Verify all imports are correct
- Clear `node_modules` and reinstall if needed

**Linting errors:**
- Use `npm run lint` to see all errors
- Most common: unused variables, missing types
- Follow existing code patterns

## Resources

- [React 19 Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)

## Questions?

If unsure about:
- **Testing**: See `client/TESTING.md` for comprehensive guide
- **State management**: Look at existing actions in `roomStore.ts`
- **Component patterns**: Check similar components in `components/` or `pages/`
- **Styling**: Follow Tailwind patterns in existing components

## Summary

**Key Principles:**
1. All tests must pass before committing
2. Write non-brittle tests focused on user behavior
3. Follow TypeScript strict mode
4. Use Zustand for all state management
5. Follow existing code patterns
6. Keep it simple and maintainable
