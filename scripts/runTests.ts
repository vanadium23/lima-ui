#!/usr/bin/env node
import chalk from "chalk";
import { spawn } from "child_process";
import { Command } from "commander";
import fs from "fs";
import path from "path";

import {
  DEVICE_PROFILES,
  DeviceProfiles,
} from "../features/config/deviceProfiles";
import { SCREENSHOTS_FOLDER } from "../utilities/pathes";

interface TestConfig {
  tags: string[];
  debug: boolean;
  visible: boolean;
  devices: DeviceProfiles[];
  perScenarioProgress: boolean;
  retry: number;
}

// Parse command line arguments
const program = new Command();

program
  .addHelpText(
    "beforeAll",
    chalk.blue.bold("\nTest Runner for Lima UI\n") +
      chalk.blue("==========================\n\n") +
      "Run tests for different devices with various options.\n",
  )
  .name("npm test")
  .description("Run tests with various options.")
  .option("-d, --desktop", "Run tests for desktop.")
  .option("-t, --tablet", "Run tests for tablet.")
  .option("-m, --mobile", "Run tests for mobile.")
  .option("-b, --broken", "Run only tests with @broken tag.")
  .option("-c, --current", "Run only tests with @current tag.")
  .option("--debug", "Run in debug mode")
  .option(
    "--visible",
    "Run browser in non-headless mode and keep it open after tests",
  )
  .option("--fail-fast", "Stop test execution after the first failure")
  .option(
    "--per-scenario-progress",
    "Use per-scenario progress formatter (scenario name: dots)",
  )
  .option("--retry <number>", "Number of times to retry failed tests", "0")
  .addHelpText(
    "afterAll",
    chalk.yellow("\nExamples:\n") +
      "  npm run test                            # Run all tests for all devices\n" +
      "  npm run test -- --desktop               # Run tests only for desktop\n" +
      "  npm run test -- --broken                # Run only broken tests for all devices\n" +
      "  npm run test -- --current               # Run only current tests for all devices\n" +
      "  npm run test -- --desktop --debug       # Run desktop tests in debug mode\n" +
      "  npm run test -- --fail-fast             # Stop after first test failure\n" +
      "  npm run test -- --per-scenario-progress # Use per-scenario progress formatter\n" +
      "  npm run test -- --retry 2               # Retry failed tests up to 2 times\n" +
      "  npm run test -- --help                  # Show this help message\n",
  )
  .showHelpAfterError("(run `npm test -- --help` for additional information)");

program.parse(process.argv);

const config: TestConfig = {
  devices: [],
  tags: ["not @broken"], // Default: exclude broken tests
  debug: program.opts().debug || false,
  visible: program.opts().visible || false,
  perScenarioProgress: program.opts().perScenarioProgress || false,
  retry: parseInt(program.opts().retry || "0", 10),
};

const { desktop, tablet, mobile, broken, current, failFast } = program.opts();

if (!desktop && !tablet && !mobile) {
  config.devices = [
    DeviceProfiles.desktop,
    DeviceProfiles.tablet,
    DeviceProfiles.mobile,
  ];
} else {
  if (desktop) config.devices.push(DeviceProfiles.desktop);
  if (tablet) config.devices.push(DeviceProfiles.tablet);
  if (mobile) config.devices.push(DeviceProfiles.mobile);
}

if (broken) {
  config.tags = ["@broken"];
} else if (current) {
  config.tags = ["@current"];
}

runTests().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});

async function runTests() {
  console.log(chalk.blue.bold("\nStarting tests with configuration:"));
  console.log(`- Devices: ${config.devices.join(", ")}`);
  console.log(`- Tags: ${config.tags.join(", ")}`);
  console.log(`- Debug: ${config.debug ? "enabled" : "disabled"}`);
  console.log(`- Visible mode: ${config.visible ? "enabled" : "disabled"}`);
  console.log(`- Fail fast: ${failFast ? "enabled" : "disabled"}`);
  console.log(
    `- Per-scenario progress: ${config.perScenarioProgress ? "enabled" : "disabled"}`,
  );
  console.log(`- Retry: ${config.retry}\n`);

  prepareEmptyScreenshotsFolder();

  const results: { device: DeviceProfiles; success: boolean }[] = [];
  let hasError = false;

  for (const device of config.devices) {
    logDeviceInfo(device);

    try {
      const command = "npx";
      const args = ["cucumber-js"];

      if (failFast) {
        args.push("--fail-fast");
      }

      if (config.tags.length > 0) {
        const escapeTagsWithSpaces = (tag: string): string => `"${tag}"`;
        args.push(
          "--tags",
          config.tags.map(escapeTagsWithSpaces).join(" and "),
        );
      }

      // Add import for TypeScript support
      args.push("--import", "tsx/cucumber/import");

      if (config.perScenarioProgress) {
        args.push("--format", "./scripts/perScenarioProgressFormatter.ts");
      }

      if (config.retry > 0) {
        args.push("--retry", config.retry.toString());
      }

      const nodeOptions = [
        process.env.NODE_OPTIONS || "",
        "--no-warnings",
        "--loader ts-node/esm",
      ]
        .filter(Boolean)
        .join(" ");

      const env = {
        ...process.env,
        DEVICE_PROFILE: device,
        ...(config.debug ? { PWDEBUG: "1", DEBUG: "cucumber" } : {}),
        ...(config.visible ? { BROWSER_VISIBLE: "1" } : {}),
        NODE_OPTIONS: nodeOptions,
        NODE_PATH: process.env.NODE_PATH || "",
        PATH: process.env.PATH || "",
      };

      const child = spawn(command, args, {
        stdio: "inherit",
        shell: true,
        cwd: process.cwd(), // Explicitly set working directory
        env: env,
      });

      const exitCode = await new Promise<number>((resolve) => {
        child.on("close", resolve);
      });

      const success = exitCode === 0;
      results.push({ device, success });

      if (!success) {
        hasError = true;
        console.log(chalk.red(`\n❌ Tests failed for ${device}\n`));
      } else {
        console.log(chalk.green(`\n✅ Tests passed for ${device}\n`));
      }
    } catch (error) {
      console.error(
        chalk.red(`\n❌ Error running tests for ${device}:`),
        error,
      );
      hasError = true;
      results.push({ device, success: false });
    }
  }

  // Print summary
  console.log("\n" + chalk.blue.bold("Test Summary:") + "\n" + "=".repeat(30));
  results.forEach(({ device, success }) => {
    const status = success ? chalk.green("PASS") : chalk.red("FAIL");
    console.log(`${device.padEnd(10)} ${status}`);
  });
  console.log("=".repeat(30));

  process.exit(hasError ? 1 : 0);
}

// Add error handling
process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

function prepareEmptyScreenshotsFolder() {
  console.log(chalk.greenBright("\nScreenshots folder cleared"));

  if (fs.existsSync(SCREENSHOTS_FOLDER)) {
    for (const file of fs.readdirSync(SCREENSHOTS_FOLDER)) {
      fs.unlinkSync(path.join(SCREENSHOTS_FOLDER, file));
    }
  } else {
    fs.mkdirSync(SCREENSHOTS_FOLDER, { recursive: true });
  }
}

function logDeviceInfo(device: string) {
  const deviceProfile =
    DEVICE_PROFILES[device as DeviceProfiles] || DEVICE_PROFILES.desktop;

  const header = chalk.bgBlue.bold(" TEST DEVICE: ");
  const deviceHeader = chalk.cyan.bold(device.toUpperCase());

  const deviceInfo = [
    `${chalk.dim("• Viewport:")} ${deviceProfile.viewport.width}x${deviceProfile.viewport.height}`,
    `${chalk.dim("• Mobile:")} ${deviceProfile.isMobile ? "Yes" : "No"}`,
    `${chalk.dim("• Touch:")} ${deviceProfile.hasTouch ? "Yes" : "No"}`,
    `${chalk.dim("• Pixel Ratio:")} ${deviceProfile.deviceScaleFactor}`,
  ].join("\n");

  // Add some spacing and a separator line
  console.log("\n" + "=".repeat(60));
  console.log(header, deviceHeader);
  console.log("\n" + deviceInfo);
  console.log("-".repeat(60) + "\n");
}
