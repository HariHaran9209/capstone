# AI-Directed Workflow Comparison: Profile Settings Form

## Workflow Overview
To evaluate the impact of prompt specificity and verification loops on AI code generation, I built a user settings form twice using two distinct strategies:
- **Round 1 (`feature/round-1-vague`):** A single, underspecified prompt ("build a settings form with validation") accepted without modification or plan review.
- **Round 2 (`feature/round-2-spec`):** A structured prompt defining file paths, explicit library constraints (`react-hook-form`, `zod`), accessibility criteria, and an automated test suite requirement.

---

## Comparative Analysis & Direct Diffs

### 1. Correctness & Schema Validation
In Round 1, the AI generated a basic component using multiple `useState` hooks and manual `if` statements for validation. This resulted in fragile input handling and unhandled edge cases. In Round 2, specifying `react-hook-form` and `zod` produced a clean, type-safe schema.
- **Diff Highlight:** Round 1 lacked input length boundaries on the bio field, whereas Round 2 implemented a strict `.max(150)` Zod string constraint and a live character counter UI.

### 2. Accessibility (a11y)
- **Round 1:** Generic `<input>` elements wrapped in simple `<div>` blocks without explicit `<label htmlFor="...">` associations or dynamic ARIA states.
- **Round 2:** Standard-compliant form markup including explicit `<label>` tags, `aria-invalid={!!errors.field}`, and live error feedback connected via `aria-describedby`.

### 3. Review Effort & Time
- **Round 1:** Initial code generation took ~30 seconds, but review and manual bug fixing required ~15 minutes to handle missing edge cases and improper types.
- **Round 2:** Drafting the specification and reviewing the execution plan took ~3 minutes. Code and unit test generation took ~1 minute. Zero manual fixing was required because automated tests verified correctness instantly.

---

## AI Mistake Caught
During Round 1, the AI wrote form error messages that rendered as plain `<span>` text without setting `role="alert"` or linking to the inputs. Additionally, it used uncontrolled inputs with type assertions (`as string`), creating potential runtime type leakage in TypeScript.

---

## Key Takeaway
Directing AI with precise specifications, structural constraints, and mandatory test loops produces production-ready, accessible code on the first attempt, dramatically reducing total development time.
