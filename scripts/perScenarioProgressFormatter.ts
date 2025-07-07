import type { IFormatterOptions } from "@cucumber/cucumber";
import chalk from "chalk";

/**
 * Note: We're defining our own interfaces here instead of importing them directly
 * from @cucumber/cucumber because the internal structure of the Cucumber.js types
 * can change between versions, and direct imports from internal paths like
 * '@cucumber/cucumber/lib/formatter/...' are not recommended for stability.
 *
 * These interfaces match the structure of the objects we receive from Cucumber.js events.
 */

// Define interfaces for Cucumber.js objects
interface Pickle {
  id: string;
  name: string;
  steps?: { length: number }[];
}

interface Envelope {
  pickle?: Pickle;
  testCaseStarted?: TestCaseStarted;
  testStepFinished?: TestStepFinished;
  testCaseFinished?: TestCaseFinished;
  testRunFinished?: TestRunFinished;
}

interface TestCaseStarted {
  id: string;
}

interface TestStepFinished {
  testCaseStartedId: string;
  testStepResult: {
    status: string;
  };
}

interface TestCaseFinished {
  testCaseStartedId: string;
}

interface TestRunFinished {
  success: boolean;
}

/**
 * Custom formatter that shows progress for each scenario on separate lines
 * Format: <Scenario name>: <Progress in dots>
 * Each step is separated by a line break
 */
class PerScenarioProgressFormatter {
  private log: IFormatterOptions["log"];
  private eventDataCollector: IFormatterOptions["eventDataCollector"];
  private eventBroadcaster: IFormatterOptions["eventBroadcaster"];
  private scenarioMap: Map<
    string,
    {
      id: string;
      name: string;
      steps: number;
      progress: string;
      completed: number;
    }
  >;
  private currentScenarioId: string | null;
  private scenarioAttempts: Map<string, number>;

  constructor(options: IFormatterOptions) {
    this.log = options.log;
    this.eventDataCollector = options.eventDataCollector;
    this.eventBroadcaster = options.eventBroadcaster;

    // Scenario tracking
    this.scenarioMap = new Map();
    this.currentScenarioId = null;
    this.scenarioAttempts = new Map();

    // Register event handlers
    this.eventBroadcaster.on("envelope", this.processEnvelope.bind(this));
  }

  processEnvelope(envelope: Envelope): void {
    if (envelope.pickle) {
      const { pickle } = envelope;

      this.scenarioMap.set(pickle.id, {
        id: pickle.id,
        name: pickle.name,
        steps: pickle.steps?.length || 0,
        progress: "",
        completed: 0,
      });
    } else if (envelope.testCaseStarted) {
      this.onTestCaseStarted(envelope.testCaseStarted);
    } else if (envelope.testStepFinished) {
      this.onTestStepFinished(envelope.testStepFinished);
    } else if (envelope.testCaseFinished) {
      this.onTestCaseFinished(envelope.testCaseFinished);
    } else if (envelope.testRunFinished) {
      this.onTestRunFinished(envelope.testRunFinished);
    }
  }

  onTestCaseStarted(testCaseStarted: TestCaseStarted): void {
    const testCase = this.eventDataCollector.getTestCaseAttempt(
      testCaseStarted.id,
    );
    if (!testCase) return;

    const pickleId = testCase.pickle.id;
    const scenarioInfo = this.scenarioMap.get(pickleId);

    if (scenarioInfo) {
      this.currentScenarioId = pickleId;

      const scenarioName = scenarioInfo.name;
      const currentAttempt = this.scenarioAttempts.get(scenarioName) || 0;
      const attemptNumber = currentAttempt + 1;
      this.scenarioAttempts.set(scenarioName, attemptNumber);

      // Make the attempt number very visible for retries
      let scenarioDisplay = scenarioName;

      if (attemptNumber > 1) {
        scenarioDisplay = chalk.yellow(
          `${scenarioName} (Retry Attempt ${attemptNumber})`,
        );
      }

      this.log(`\n${scenarioDisplay}: `);
    }
  }

  onTestStepFinished(testStepFinished: TestStepFinished): void {
    if (!this.currentScenarioId) return;

    const testCaseAttempt = this.eventDataCollector.getTestCaseAttempt(
      testStepFinished.testCaseStartedId,
    );
    if (!testCaseAttempt) return;

    const scenarioInfo = this.scenarioMap.get(this.currentScenarioId);
    if (!scenarioInfo) return;

    const status = testStepFinished.testStepResult.status;

    // Add a colored dot based on step status
    let dot = ".";

    // Handle status with string comparisons instead of enum
    switch (status) {
      case "PASSED":
        dot = chalk.green(".");
        break;
      case "FAILED":
        dot = chalk.red("F");
        break;
      case "PENDING":
        dot = chalk.yellow("P");
        break;
      case "UNDEFINED":
        dot = chalk.yellow("U");
        break;
      case "SKIPPED":
        dot = chalk.cyan("-");
        break;
      case "AMBIGUOUS":
        dot = chalk.red("A");
        break;
    }

    scenarioInfo.progress += dot;
    scenarioInfo.completed++;

    this.log(dot);
  }

  onTestCaseFinished(_testCaseFinished: TestCaseFinished): void {
    if (this.currentScenarioId) {
      // End the line for this scenario
      this.log("");
      this.currentScenarioId = null;
    }
  }

  onTestRunFinished(_testRunFinished?: TestRunFinished): void {
    // Use the scenarioMap to count scenarios
    const scenarioCount = this.scenarioMap.size;

    // Print simplified summary
    this.log(`\n${scenarioCount} scenario${scenarioCount !== 1 ? "s" : ""}`);
    this.log("Test run finished");
  }

  // Required method for Cucumber.js formatters
  finished(): boolean {
    return true;
  }
}

export default PerScenarioProgressFormatter;
