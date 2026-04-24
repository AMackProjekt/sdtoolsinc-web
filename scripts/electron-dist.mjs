import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, unlinkSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const dryRun = process.argv.includes("--dry-run");

const RETRYABLE_PATTERNS = [
  "The process cannot access the file because it is being used by another process",
  "LGHT1032",
  "ERR_ELECTRON_BUILDER_CANNOT_EXECUTE",
];

const SUCCESS_WITH_ARTIFACT_PATTERNS = ["LGHT1032"];

function getPackageMeta() {
  try {
    const packageJsonPath = path.join(rootDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    const productName = packageJson.build?.productName ?? "app";
    const version = packageJson.version ?? "0.0.0";
    const appName = packageJson.name ?? "app";

    return { productName, version, appName };
  } catch {
    return {
      productName: "T.O.O.L.S Inc - Enterprise Demo",
      version: "1.0.0",
      appName: "toolsinc-dashdarkx",
    };
  }
}

const packageMeta = getPackageMeta();

function getExpectedArtifacts(outputDir) {
  const outputPath = path.join(rootDir, outputDir);
  const msiName = `${packageMeta.productName} ${packageMeta.version}.msi`;
  const exeName = `${packageMeta.appName} Setup ${packageMeta.version}.exe`;

  return {
    outputPath,
    msiPath: path.join(outputPath, msiName),
    exePath: path.join(outputPath, exeName),
  };
}

function hasExpectedInstaller(outputDir) {
  const { msiPath, exePath } = getExpectedArtifacts(outputDir);
  return existsSync(msiPath) || existsSync(exePath);
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    cwd: rootDir,
    encoding: "utf8",
    stdio: "pipe",
    shell: false,
    ...options,
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.error) {
    process.stderr.write(`${result.error.message}\n`);
  }

  return {
    code: result.status ?? 1,
    output: `${result.stdout ?? ""}\n${result.stderr ?? ""}\n${result.error?.message ?? ""}`,
  };
}

function tryKillProcess(imageName) {
  if (process.platform !== "win32") return;
  run("taskkill", ["/F", "/T", "/IM", imageName]);
}

function forceCleanPath(targetPath) {
  if (!existsSync(targetPath)) return;
  rmSync(targetPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
}

function ensureWritableDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
  const probePath = path.join(dirPath, `.write-test-${Date.now()}.tmp`);
  writeFileSync(probePath, "ok", "utf8");
  unlinkSync(probePath);
}

function cleanupOutput(outputDir) {
  const { outputPath, msiPath, exePath } = getExpectedArtifacts(outputDir);
  const filesToDelete = [msiPath, exePath, `${exePath}.blockmap`];

  let cleanupHealthy = true;

  for (const directoryName of ["win-unpacked", "__msi-x64"]) {
    const targetPath = path.join(outputPath, directoryName);
    try {
      forceCleanPath(targetPath);
    } catch (error) {
      cleanupHealthy = false;
      console.warn(`[electron-dist] Could not clean ${targetPath}: ${error.message}`);
    }
  }

  for (const fileName of filesToDelete) {
    const targetPath = fileName;
    try {
      forceCleanPath(targetPath);
    } catch (error) {
      cleanupHealthy = false;
      console.warn(`[electron-dist] Could not remove ${targetPath}: ${error.message}`);
    }
  }

  try {
    ensureWritableDir(outputPath);
  } catch (error) {
    cleanupHealthy = false;
    console.warn(`[electron-dist] Output directory not writable (${outputPath}): ${error.message}`);
  }

  return cleanupHealthy;
}

function isRetryableFailure(output) {
  return RETRYABLE_PATTERNS.some((pattern) => output.includes(pattern));
}

function isArtifactSuccessFailure(output) {
  return SUCCESS_WITH_ARTIFACT_PATTERNS.some((pattern) => output.includes(pattern));
}

function runElectronBuilder(outputDir) {
  const args = ["electron-builder", `--config.directories.output=${outputDir}`];

  if (process.platform === "win32") {
    return run("cmd", ["/c", "npx", ...args]);
  }

  return run("npx", args);
}

function main() {
  console.log("[electron-dist] Preparing resilient installer build...");
  const uniqueFallbackOutput = `dist-rebuild-${Date.now()}`;

  if (process.platform === "win32") {
    // Kill only app executables that commonly lock app.asar.
    tryKillProcess("toolsinc-dashdarkx.exe");
    tryKillProcess("T.O.O.L.S Inc - Enterprise Demo.exe");
  }

  const attempts = [
    { outputDir: "dist", retries: 2 },
    { outputDir: uniqueFallbackOutput, retries: 1 },
  ];

  for (const { outputDir, retries } of attempts) {
    for (let attempt = 1; attempt <= retries; attempt += 1) {
      console.log(`[electron-dist] Attempt ${attempt}/${retries} using ${outputDir}`);
      const cleanupHealthy = cleanupOutput(outputDir);
      if (!cleanupHealthy && outputDir === "dist") {
        console.warn("[electron-dist] Skipping dist due to cleanup/write issues. Trying fallback output.");
        break;
      }

      if (dryRun) {
        console.log("[electron-dist] Dry run complete.");
        return;
      }

      const result = runElectronBuilder(outputDir);
      if (result.code === 0) {
        console.log(`[electron-dist] Build succeeded in ${outputDir}`);
        return;
      }

      if (isArtifactSuccessFailure(result.output) && hasExpectedInstaller(outputDir)) {
        const { msiPath, exePath } = getExpectedArtifacts(outputDir);
        console.warn("[electron-dist] Builder reported LGHT1032, but installer artifact exists. Treating build as successful.");
        if (existsSync(msiPath)) console.log(`[electron-dist] MSI: ${msiPath}`);
        if (existsSync(exePath)) console.log(`[electron-dist] EXE: ${exePath}`);
        return;
      }

      if (!isRetryableFailure(result.output)) {
        console.error("[electron-dist] Non-retryable build failure.");
        process.exit(result.code);
      }

      const delayMs = 1500 * attempt;
      console.warn(`[electron-dist] Retryable failure detected. Waiting ${delayMs}ms before retry...`);
      sleep(delayMs);
    }
  }

  console.error("[electron-dist] Build failed after all retries.");
  process.exit(1);
}

main();
