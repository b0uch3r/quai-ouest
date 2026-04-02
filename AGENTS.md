# Quai Ouest -- Repo Instructions

These instructions apply to `C:\Users\auror\Documents\quai-ouest\quai-ouest`.
They override the shared workspace instructions in `C:\Users\auror\Documents\AGENTS.md` for this repository.

## Repo Scope

- Treat this repository as the canonical `quai-ouest` working copy unless the user explicitly says otherwise.
- Do not edit sibling `quai-ouest` copies from here.
- Keep changes scoped to this repository only.

## Project Layout

- The public showcase site is primarily driven by root static files such as `index.html`, `404.html`, and `politique-confidentialite.html`.
- The reservation back office and API flow live in `reservation-app/`.
- Images are stored in `assets/images/` with responsive variants in `assets/images/optimized/`.
- The folder `nouveau fichier projet/` is a raw asset drop area. Do not rename, delete, or clean it up unless the user asks.

## Current Site Decisions

- The gallery in `index.html` is intentionally simple:
  - aligned grid
  - food photos integrated directly in the gallery
  - only short titles under photos
  - no long captions, badges, or marketing copy unless the user explicitly requests them
- The restaurant photos kept in the gallery should stay limited to a small set of place-forward images. Do not turn the gallery back into a mixed bar or ambiance wall unless asked.
- Use `Boeuf saignant` wording for the meat plate, not `boeuf rose`.
- Two older standalone food sections still exist in `index.html` but are hidden with `hidden aria-hidden="true"`:
  - `#assiettes-signature`
  - `#douceurs-signature`
  Leave them hidden unless the user asks for a cleanup or a full removal.

## Editing Guidance

- Preserve the existing visual language of the site. Prefer restrained polish over large redesigns.
- When adjusting the gallery, keep card heights visually aligned and titles readable.
- Prefer editing source HTML/CSS directly over introducing new tooling or abstractions for simple showcase changes.
- Do not touch unrelated files or workspace-wide instruction files unless the user explicitly asks.

## Verification

- For root showcase edits, run the smallest useful check:
  - `npx --yes htmlhint index.html`
- If `404.html` or `politique-confidentialite.html` are changed too, include them in the same `htmlhint` run.
- For reservation app changes, also run:
  - `npm run build` from `reservation-app/`

## Safety

- Never commit secrets or `.env` values.
- Respect a dirty worktree and do not revert user changes you did not make.
- Avoid deleting image assets, temporary raw uploads, or hidden sections without explicit approval.
