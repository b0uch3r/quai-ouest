# Quai Ouest -- Claude Notes

See `@AGENTS.md` first for the shared repo rules.

## Recommended Workflow

- For showcase edits, inspect `index.html` first because most user-facing changes happen there.
- Keep gallery changes conservative:
  - titles only under photos
  - aligned grid
  - limited number of place photos
  - no return to long descriptive captions unless requested
- If a visual change touches the reservation experience too, inspect `reservation-app/` separately instead of assuming the root site handles it.

## Recommended Checks

- Run `npx --yes htmlhint index.html` after root HTML changes.
- Run `npm run build` in `reservation-app/` after reservation app edits.

## Handoff Notes

- Root shared instructions live in `C:\Users\auror\Documents\AGENTS.md`.
- This repo-level file exists to keep Quai Ouest decisions local and avoid affecting other projects in `Documents`.
