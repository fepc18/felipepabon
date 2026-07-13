# Harness Engineering with Claude Code

You give Claude Code access to your repo, tell it to implement the payments module, and walk away. It probably does it. But there's a good chance it also rewrites files it shouldn't have touched, skips tests because nobody demanded them, or uses a deprecated library it doesn't know is off-limits.

The problem isn't the agent. The problem is you let it loose without a harness.

---

## What is Harness Engineering?

Harness Engineering is the discipline of wrapping your AI coding agent with a structured layer that:

1. **Defines how it works** — before it runs its first command
2. **Detects when it deviates** — in real time, during execution
3. **Verifies before production** — autonomously, in a sandbox
4. **Delivers controlled output** — reviewable and reversible

The difference between an agent that "sometimes works" and one you can actually delegate real work to is, precisely, the harness.

---

## The 4 Components (with Claude Code specifics)

### 1. Guides → CLAUDE.md

This is the contract. Not a README — a contract.

Your `CLAUDE.md` at the repo root tells the agent:
- What tech stack and exact versions are in use
- Which folders are off-limits (e.g., `/migrations`, infrastructure configs)
- What test and lint commands to run before committing
- What commit message format to follow
- When to stop and ask instead of deciding alone (e.g., before deleting a file, before changing a public API signature)

An agent without a `CLAUDE.md` is like a developer without onboarding — it guesses the project's rules, and sometimes guesses wrong.

### 2. Sensors → Claude Code Hooks

Hooks are the nervous system of the harness. Claude Code supports four types:
- `PreToolUse` — runs before a tool executes
- `PostToolUse` — runs after
- `Notification` — when the agent wants to surface something
- `Stop` — when the agent finishes a session

The most powerful for a coding harness are `PreToolUse` and `PostToolUse`.

A `PreToolUse` hook receives a JSON payload with the tool name and its arguments, and can return a non-zero exit code to block execution entirely. Common checks:

- Block `rm` or `Write` on protected paths
- Block direct pushes to `main`
- Block installation of packages not in your approved list
- Flag usage of deprecated internal libraries

A `PostToolUse` hook can verify that tests still pass after any file was written, and feed that result back to the agent so it self-corrects.

You configure hooks in `.claude/settings.json`. They can be bash scripts, Python, or any executable — whatever fits your toolchain.

### 3. Sandbox → Tests + Linting + Build

The sandbox is where the agent's code must survive before it's considered valid output.

What makes this powerful: the agent can run the sandbox itself. Claude Code can execute `make test`, read the output, identify what failed, fix it, and re-run — without you in the loop. The sandbox turns the agent into an autonomous feedback loop.

A minimal sandbox for most projects:
- Unit tests (`npm test`, `go test ./...`, `pytest`)
- Linting (`eslint`, `golangci-lint`, `flake8`)
- Build verification

The `CLAUDE.md` should explicitly state: "Before every commit, run `make test && make lint`. If either fails, fix it before continuing." Pair that with a `PostToolUse` hook that checks repo state, and the agent rarely delivers broken code.

### 4. Output → Git Commits + PRs

Output isn't just the code the agent produces. It's how that code enters your team's control system.

A well-designed harness output is:
- **On a branch** — never directly on main
- **Atomic commits** — one logical change per commit, with descriptive messages
- **A PR with a summary** — what was changed, why, and what the agent left for human review

Ask the agent to end every session with a structured summary: files modified, tests added, decisions made, and open questions. That turns it into an explainable collaborator — not a black box.

---

## A Minimal Harness Setup

Here's what a functional harness looks like in practice — no complex infrastructure needed:

```
repo/
├── CLAUDE.md                    ← Guides: rules, conventions, commands
├── .claude/
│   └── settings.json            ← Sensors: hook configuration
└── Makefile                     ← Sandbox: test, lint, build targets
```

**`CLAUDE.md` essentials:**
```markdown
## Project Rules
- Stack: Node 20, Express 4, PostgreSQL 15
- Never modify: /migrations, /infra, .env files
- Before every commit: run `make test && make lint`
- Work on branches only. Open a PR when done.
- When deleting files or changing public APIs: stop and ask.
```

**`.claude/settings.json` with a guard hook:**
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "python3 .claude/hooks/guard.py"
      }]
    }]
  }
}
```

**`guard.py` — a minimal sensor:**
```python
import json, sys

payload = json.load(sys.stdin)
tool_input = payload.get("tool_input", {})
path = tool_input.get("file_path", "")

PROTECTED = ["/migrations/", "/infra/", ".env"]
if any(p in path for p in PROTECTED):
    print(f"BLOCKED: {path} is a protected path.")
    sys.exit(1)
```

With this in place, the agent can work autonomously on medium-complexity tickets and deliver output the team can trust.

---

## The Key Insight

The temptation with coding agents is to move fast — give full access, ask for the feature, see what happens. It works sometimes. But as your codebase grows or the stakes increase, that approach gets fragile.

Harness Engineering is what makes agent-assisted development a sustainable practice, not a gamble.

An agent with a good harness doesn't just produce better code. It produces code your team can audit, review, and evolve with confidence.

**AI engineering doesn't end at the model. It ends at the system surrounding it.**

---

*Originally published at [felipepabon.github.io/felipepabon/blog/harness-engineering-claude-code.html](https://felipepabon.github.io/felipepabon/blog/harness-engineering-claude-code.html)*
