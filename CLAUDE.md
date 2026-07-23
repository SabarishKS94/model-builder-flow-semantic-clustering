# CLAUDE.md

Read and follow `AGENTS.md` for all project architecture, conventions, and coding rules.

This file contains Claude Code-specific additions that complement `AGENTS.md`.

---

## Mandatory Skill Gates for LWC Work

These skills MUST be invoked before taking the associated action. Do not skip them or act first and check later.

| Trigger | Skill to invoke | When |
|---------|----------------|------|
| Creating any new component under `src/modules/` | `lwc-new-component:lwc-new-component` | Before creating any files |
| Writing or editing `.html`, `.css`, `.js` in `src/modules/` | `lwc-ui-checklist:lwc-ui-checklist` | Before writing any markup, styling, or logic |
| Editing `cosmos-theme.css`, `cosmosApp.css`, or brand CSS | `/theme-audit` | Before writing any change |
| Adding a new page or nav item | `add-nav-item:add-nav-item` | Before creating route or nav entry |

These gates exist to ensure SLDS compliance, correct LWC patterns, and theme architecture rules are applied from the start, not retrofitted after the fact.

## Freezing a design version

When the user says any of:
- "freeze this as v1" / "freeze as v2" / "save this as v3"
- "freeze the current design as vN"
- "make this version N"

...run the freeze command with the version number they named:

```
npm run freeze:gh -- --version=vN
```

Use `freeze:soma` instead of `freeze:gh` only if the user explicitly asks for the internal Salesforce version.

After the command finishes, do these things:

1. Copy the "Frozen. This version now lives at: ..." URL from the output.
2. Tell the user the URL clearly, e.g.:
   > **Frozen v1** — https://sabarishks94.github.io/.../versions/v1/
3. Ask what changed in this version so they can capture it in the shelf. Prompt for: a short label (2–4 words), a one-sentence summary, and 3–6 bullet points of what changed.
4. Once they answer, remind them to paste the URL, label, summary, and bullets into their `the-prototype-shelf` project so it can be added to `flows.js` under this project's `versions` block.

**Do not** invent version numbers. If the user says "freeze this" without a number, ask which version number to use.

**Do not** guess the summary or bullets. Those are design decisions — always ask the user for the exact copy.

## Responding to Hook Failures

When a PostToolUse hook exits non-zero (e.g., the lint architecture hook flags a violation):

1. **Do not ignore it.** The edit persisted but violates project rules.
2. **Ask the user** if they would like you to fix the violations the correct way. Present the specific violation and explain how to fix it.
3. **Do not silently re-attempt the same edit.** The user explicitly asked for the change — respect that intent while surfacing the conflict.
4. If the user says to proceed anyway, leave the violation in place — they own the decision.
