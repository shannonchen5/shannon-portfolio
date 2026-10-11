import { spawnSync } from "node:child_process";

const hasCloud =
  Boolean(process.env.NEXT_PUBLIC_TINA_CLIENT_ID) &&
  Boolean(process.env.TINA_TOKEN);

const args = hasCloud
  ? ["tinacms", "build"]
  : ["tinacms", "build", "--local", "--skip-cloud-checks"];

console.log(
  hasCloud
    ? "Tina build: production (Tina Cloud)"
    : "Tina build: local filesystem (no Tina Cloud env)",
);

const result = spawnSync("npx", args, {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
