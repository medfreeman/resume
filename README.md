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

## Automatic registry updates

The [live version](https://registry.jsonresume.org/medfreeman) is served from a GitHub Gist, kept in sync by the [`resume.yml`](.github/workflows/resume.yml) workflow, which pushes `resume.json` to that gist on every push to this repo.

One-time setup:

1. Create a public gist named `resume.json` and note its ID.
2. Generate a [personal access token](https://github.com/settings/tokens) with the `gist` scope only.
3. Add it as a repository secret named `GIST_PUBLISH_TOKEN` (Settings > Secrets and variables > Actions).
4. Set that gist's ID as `gist_id` in `.github/workflows/resume.yml`.

After this, pushing changes to `resume.json` updates the gist, and the registry reflects it within a minute.

## Development

Commits are linted and formatted automatically via Husky and lint-staged (Prettier on `resume.json` and `resume.code-workspace`).
