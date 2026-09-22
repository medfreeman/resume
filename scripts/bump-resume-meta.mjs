// @ts-check
import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import process from "node:process";

const RESUME_PATH = new URL("../resume.json", import.meta.url);

/**
 * @param {string} version
 * @returns {string}
 */
function bumpPatch(version) {
  const match = version.match(/^(v?)(\d+)\.(\d+)\.(\d+)$/);

  if (!match) {
    throw new Error(`Cannot parse version "${version}"`);
  }

  const [, prefix, major, minor, patch] = match;
  return `${prefix}${major}.${minor}.${Number(patch) + 1}`;
}

/** @returns {string[]} */
function getStagedFiles() {
  return execFileSync("git", ["diff", "--cached", "--name-only"], {
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
}

/** @returns {Promise<void>} */
async function main() {
  if (!getStagedFiles().includes("resume.json")) {
    return;
  }

  const staged = execFileSync("git", ["show", ":resume.json"], {
    encoding: "utf8",
  });
  const resume = JSON.parse(staged);

  resume.meta.version = bumpPatch(resume.meta.version);
  resume.meta.lastModified = new Date().toISOString().slice(0, 10);

  await writeFile(RESUME_PATH, `${JSON.stringify(resume, null, 2)}\n`);
  execFileSync("git", ["add", "resume.json"]);

  console.log(
    `Bumped resume.json to ${resume.meta.version} (lastModified: ${resume.meta.lastModified})`,
  );
}

main().catch((/** @type {unknown} */ error) => {
  console.error(error);
  process.exitCode = 1;
});
