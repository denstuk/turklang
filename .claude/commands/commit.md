---
description: Create a conventional commit
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git commit:*)
---

## Context

- Git status: !`git status`
- Staged/unstaged diff: !`git diff HEAD`
- Recent commits (for style reference): !`git log --oneline -5`

## Rules

**Format:** `<type>(<scope>): <subject>`

**Types:**

- `feat` — new feature
- `fix` — bug fix
- `refactor` — code change, not a fix or feature
- `chore` — tooling, deps, config, build
- `docs` — documentation only
- `test` — adding or fixing tests
- `perf` — performance improvement
- `ci` — CI/CD changes
- `style` — formatting, no logic change

**Subject line:**

- Lowercase, imperative mood ("add" not "added", "adds")
- No period at the end
- Max 72 characters
- Scope is optional — use only when it meaningfully narrows context (e.g., `feat(auth):`, `fix(parser):`)

**Body (optional):**

- Blank line after subject
- Explain _why_, not _what_ — the diff already shows what
- Wrap at 72 characters

**Breaking changes:** append `!` after type/scope, e.g. `feat!:` or `feat(api)!:`

## Task

1. Stage all relevant changes (`git add`)
2. Craft a commit message following the rules above
3. Commit with `git commit -m`

Do not explain or summarize after committing. No trailing messages.