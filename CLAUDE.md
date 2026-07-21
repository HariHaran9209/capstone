# Project Guidelines & AI Rules

## Form & State Rules
1. All forms must be built using `react-hook-form` integrated with `zod` for schema validation. Using raw `useState` for complex form state or manual `if/else` validation is prohibited.

## Accessibility Rules
2. Every interactive form input must have a corresponding `<label>` with a matching `htmlFor` ID, explicit `aria-invalid` attributes for error states, and visible focus styles (`focus:ring-2`).

## Testing Rules
3. Every new component or feature must include a co-located unit test file (e.g., `__tests__/ComponentName.test.tsx`) covering initial rendering, error/invalid input states, and successful user interactions before code is considered complete.
