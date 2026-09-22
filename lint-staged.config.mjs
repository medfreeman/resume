// @ts-check

/** @type {import('lint-staged').Configuration} */
export default {
  "resume.code-workspace": "prettier --write",
  "*.json": "prettier --write",
  "*.yml": "prettier --write",
  "{scripts/**/*.mjs,bs-config.cjs}": [
    "prettier --write",
    () => "npm run typecheck",
  ],
};
