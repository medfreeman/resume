# Resume

Mehdi Lahlou's resume, written in the [JSON Resume](https://jsonresume.org/) format and rendered with the [modern-classic](https://github.com/erming/jsonresume-theme-modern-classic) theme.

- Source: [resume.json](resume.json)
- Live version: <https://registry.jsonresume.org/medfreeman>

## Setup

```bash
npm install
```

## Usage

Render to HTML (`resume.html`):

```bash
npm run render
```

Export to PDF (`resume.pdf`):

```bash
npm run export
```

Validate `resume.json` against the JSON Resume schema:

```bash
npm test
```

Check the rendered resume against ATS (Applicant Tracking System) best practices:

```bash
npm run validate
```

This renders `resume.json` with the theme and scores the output using [`@jsonresume/ats-validator`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/ats-validator), failing if the score drops below 90/100.

Check formatting:

```bash
npm run format
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), enforced by [commitlint](https://commitlint.js.org/):

```bash
npm run commitlint -- --from <ref> --to <ref>
```

## Continuous integration

The [`CI`](.github/workflows/ci.yml) workflow runs `npm run commitlint`, `npm run format`, `npm run typecheck`, `npm test`, and `npm run validate` on every push and pull request targeting `main`. The `validate` check is required on `main` (including for admins) via branch protection.

CI also publishes a separate `ATS score` check with the score and grade (e.g. "ATS score: 94/100 (A)"), visible directly in the commit/PR checks list.

## Automatic registry updates

The [live version](https://registry.jsonresume.org/medfreeman) is served from a GitHub Gist, kept in sync by the [`resume.yml`](.github/workflows/resume.yml) workflow. It runs after the `CI` workflow completes on `main`, and only pushes `resume.json` to the gist if CI succeeded — a failing push never updates the live version.

One-time setup:

1. Create a public gist named `resume.json` and note its ID.
2. Generate a [personal access token](https://github.com/settings/tokens) with the `gist` scope only.
3. Add it as a repository secret named `GIST_PUBLISH_TOKEN` (Settings > Secrets and variables > Actions).
4. Set that gist's ID as `gist_id` in `.github/workflows/resume.yml`.

After this, a push to `main` that passes CI updates the gist, and the registry reflects it within a minute.

## Development

Commits are linted and formatted automatically via Husky: a `pre-commit` hook bumps `meta.version` (patch) and sets `meta.lastModified` to today whenever `resume.json` is staged (`npm run bump-resume-meta`), then lint-staged runs Prettier on `resume.json` and `resume.code-workspace`, and type checking (`npm run typecheck`, via [jsconfig.json](jsconfig.json) and JSDoc annotations) on `scripts/**/*.mjs`; a `commit-msg` hook runs commitlint on the commit message.
