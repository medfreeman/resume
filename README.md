# Resume

Mehdi Lahlou's resume, written in the [JSON Resume](https://jsonresume.org/) format and rendered with the [modern-classic](https://github.com/erming/jsonresume-theme-modern-classic) theme.

- Source: [resume.json](resume.json)
- Live version: https://registry.jsonresume.org/medfreeman

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

## Development

Commits are linted and formatted automatically via Husky and lint-staged (Prettier on `resume.json` and `resume.code-workspace`).
