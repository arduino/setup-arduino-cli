import io = require("@actions/io");
import path = require("path");
import os = require("os");
import fs = require("fs");
import nock = require("nock");

const toolDir = path.join(__dirname, "runner", "tools");
const tempDir = path.join(__dirname, "runner", "temp");
const dataDir = path.join(__dirname, "testdata");
const IS_WINDOWS = process.platform === "win32";

process.env["RUNNER_TEMP"] = tempDir;
process.env["RUNNER_TOOL_CACHE"] = toolDir;
import * as installer from "../src/installer";

describe("installer tests", () => {
  beforeEach(async function() {
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
  }, 10000);

  describe("Gets the latest release of Arduino CLI", () => {
    beforeEach(() => {
      nock("https://api.github.com")
        .get("/repos/Arduino/arduino-cli/git/refs/tags")
        .replyWithFile(200, path.join(dataDir, "tags.json"));
    });

    afterEach(() => {
      nock.cleanAll();
      nock.enableNetConnect();
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
    }, 10000);

    it("Gets latest version of Task using 0.x and no matching version is installed", async () => {
      await installer.getArduinoCli("0.x");
      const bindir = path.join(toolDir, "arduino-cli", "0.5.0", os.arch());

      expect(fs.existsSync(`${bindir}.complete`)).toBe(true);
      if (IS_WINDOWS) {
        expect(fs.existsSync(path.join(bindir, "arduino-cli.exe"))).toBe(true);
      } else {
        expect(fs.existsSync(path.join(bindir, "arduino-cli"))).toBe(true);
      }
    }, 10000);
  });
});
