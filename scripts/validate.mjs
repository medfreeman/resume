// @ts-check
import { appendFile, readFile } from "node:fs/promises";
import process from "node:process";
import { getRecommendations, validateATS } from "@jsonresume/ats-validator";
import { render } from "jsonresume-theme-modern-classic/dist";

const RESUME_PATH = new URL("../resume.json", import.meta.url);

/** @returns {number} */
function parseMinScore() {
  const arg = process.argv[2];

  if (!arg) {
    console.error(
      "Usage: node scripts/validate.mjs <min-score>\n" +
        "A minimum ATS score (0-100) is required.",
    );
    process.exit(1);
  }

  const minScore = Number(arg);

  if (!Number.isFinite(minScore) || minScore < 0 || minScore > 100) {
    console.error(`Invalid minimum score: "${arg}" (expected a number 0-100).`);
    process.exit(1);
  }

  return minScore;
}

/**
 * Writes a `name=value` line to the file at `$GITHUB_OUTPUT`, if set, so a
 * later workflow step can read it via `steps.<id>.outputs.<name>`.
 * @param {string} name
 * @param {string} value
 * @returns {Promise<void>}
 */
async function setGithubOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;

  if (!outputPath) {
    return;
  }

  await appendFile(outputPath, `${name}=${value}\n`);
}

/**
 * @typedef {object} AtsCheck
 * @property {string} name
 * @property {number} score
 * @property {number} maxScore
 * @property {boolean} passed
 * @property {string[]} issues
 */

/**
 * @typedef {object} AtsResult
 * @property {number} score
 * @property {'A'|'B'|'C'|'D'|'F'} grade
 * @property {'excellent'|'good'|'fair'|'poor'} atsCompatibility
 * @property {number} passed
 * @property {number} failed
 * @property {AtsCheck[]} checks
 */

/** @returns {Promise<void>} */
async function main() {
  const minScore = parseMinScore();
  const resume = JSON.parse(await readFile(RESUME_PATH, "utf8"));
  const html = await render(resume);

  const result = /** @type {AtsResult} */ (validateATS(html));
  const passed = result.score >= minScore;

  console.log(
    `ATS score: ${result.score}/100 (${result.grade}, ${result.atsCompatibility})`,
  );
  console.log(`Checks passed: ${result.passed}, failed: ${result.failed}`);

  for (const recommendation of getRecommendations(result)) {
    console.log(recommendation);
  }

  await setGithubOutput("score", String(result.score));
  await setGithubOutput("grade", result.grade);
  await setGithubOutput("min_score", String(minScore));
  await setGithubOutput("passed", String(passed));

  if (!passed) {
    console.error(
      `\nATS score ${result.score} is below the required minimum of ${minScore}.`,
    );
    process.exitCode = 1;
  }
}

main().catch((/** @type {unknown} */ error) => {
  console.error(error);
  process.exitCode = 1;
});
