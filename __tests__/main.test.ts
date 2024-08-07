import * as core from "@actions/core";
import * as io from "@actions/io";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import nock from "nock";

const toolDir = path.join(__dirname, "runner", "tools");
const tempDir = path.join(__dirname, "runner", "temp");
const dataDir = path.join(__dirname, "testdata");
const IS_WINDOWS = process.platform === "win32";

process.env["RUNNER_TEMP"] = tempDir;
process.env["RUNNER_TOOL_CACHE"] = toolDir;
import * as installer from "../src/installer";

// Inputs for mock @actions/core
let inputs = {
  token: process.env.GITHUB_TOKEN || "",
} as any;

describe("installer tests", () => {
  beforeEach(async function () {
    // Mock getInput
    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      return inputs[name];
    });

    await io.rmRF(toolDir);
    await io.rmRF(tempDir);
    await io.mkdirP(toolDir);
    await io.mkdirP(tempDir);
  });

  afterAll(async () => {
    try {
      await io.rmRF(toolDir);
      await io.rmRF(tempDir);
    } catch {
      console.log("Failed to remove test directories");
    }
    jest.restoreAllMocks();
  });

  it("Downloads version of Arduino CLI if no matching version is installed", async () => {
    await installer.getArduinoCli("0.4.0");
    const bindir = path.join(toolDir, "arduino-cli", "0.4.0", os.arch());

    expect(fs.existsSync(`${bindir}.complete`)).toBe(true);

    if (IS_WINDOWS) {
      expect(fs.existsSync(path.join(bindir, "arduino-cli.exe"))).toBe(true);
    } else {
      expect(fs.existsSync(path.join(bindir, "arduino-cli"))).toBe(true);
    }
  }, 20000);

  describe("Gets the latest release of Arduino CLI", () => {
    beforeEach(() => {
      jest.spyOn(core, "getInput").mockImplementation((name: string) => {
        return inputs[name];
      });

      nock("https://api.github.com")
        .get("/repos/Arduino/arduino-cli/git/refs/tags")
        .replyWithFile(200, path.join(dataDir, "tags.json"));
    });

    afterEach(() => {
      nock.cleanAll();
      nock.enableNetConnect();
      jest.clearAllMocks();
    });

    it("Gets the latest version of Arduino CLI 0.4.0 using 0.4 and no matching version is installed", async () => {
      await installer.getArduinoCli("0.4");
      const bindir = path.join(toolDir, "arduino-cli", "0.4.0", os.arch());

      expect(fs.existsSync(`${bindir}.complete`)).toBe(true);
      if (IS_WINDOWS) {
        expect(fs.existsSync(path.join(bindir, "arduino-cli.exe"))).toBe(true);
      } else {
        expect(fs.existsSync(path.join(bindir, "arduino-cli"))).toBe(true);
      }
    }, 20000);

    it("Gets the latest version of Arduino CLI v1.0.0 using 1.0.0 with no `v` prefix", async () => {
      await installer.getArduinoCli("1.0.0");
      const bindir = path.join(toolDir, "arduino-cli", "1.0.0", os.arch());

      expect(fs.existsSync(`${bindir}.complete`)).toBe(true);
      if (IS_WINDOWS) {
        expect(fs.existsSync(path.join(bindir, "arduino-cli.exe"))).toBe(true);
      } else {
        expect(fs.existsSync(path.join(bindir, "arduino-cli"))).toBe(true);
      }
    }, 20000);

    it("Gets the latest version of Arduino CLI v1.0.0 using the `v` prefix (v1.0.0)", async () => {
      await installer.getArduinoCli("v1.0.0");
      const bindir = path.join(toolDir, "arduino-cli", "1.0.0", os.arch());

      expect(fs.existsSync(`${bindir}.complete`)).toBe(true);
      if (IS_WINDOWS) {
        expect(fs.existsSync(path.join(bindir, "arduino-cli.exe"))).toBe(true);
      } else {
        expect(fs.existsSync(path.join(bindir, "arduino-cli"))).toBe(true);
      }
    }, 20000);

    it("Gets the latest version of Arduino CLI using the v1.x", async () => {
      await installer.getArduinoCli("v1.x");
      const bindir = path.join(toolDir, "arduino-cli", "1.0.1", os.arch());

      expect(fs.existsSync(`${bindir}.complete`)).toBe(true);
      if (IS_WINDOWS) {
        expect(fs.existsSync(path.join(bindir, "arduino-cli.exe"))).toBe(true);
      } else {
        expect(fs.existsSync(path.join(bindir, "arduino-cli"))).toBe(true);
      }
    }, 20000);

    it("Gets latest version of Arduino CLI using 0.x and no matching version is installed", async () => {
      await installer.getArduinoCli("0.x");
      const bindir = path.join(
        toolDir,
        "arduino-cli",
        "0.36.0-rc.2",
        os.arch(),
      );

      expect(fs.existsSync(`${bindir}.complete`)).toBe(true);
      if (IS_WINDOWS) {
        expect(fs.existsSync(path.join(bindir, "arduino-cli.exe"))).toBe(true);
      } else {
        expect(fs.existsSync(path.join(bindir, "arduino-cli"))).toBe(true);
      }
    }, 20000);
  });
});
