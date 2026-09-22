// @ts-check
const { execFile, execSync } = require("node:child_process");

/** @type {import("browser-sync").Options} */
module.exports = {
  server: { baseDir: ".", index: "resume.html" },
  // browser-sync's bundled opener (opn@5) shells out to `cmd.exe /c start ... /wait`
  // under WSL, which reliably exits non-zero there and only ever logs "Couldn't open
  // browser". Open the Windows default browser directly instead.
  open: false,
  notify: false,
  callbacks: {
    ready(err, bs) {
      if (err) return;
      execFile("explorer.exe", [`http://localhost:${bs.getOption("port")}`]).on(
        "error",
        () => {},
      );
    },
  },
  files: [
    {
      match: ["resume.json"],
      fn(event) {
        if (event === "change")
          execSync("npm run render", { stdio: "inherit" });
      },
    },
    "resume.html",
  ],
};
