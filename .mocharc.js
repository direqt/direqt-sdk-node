"use strict";

module.exports = {
  recursive: true,
  require: ["dotenv/config", "ts-node/register"],
  spec: ["./test/**/*.test.ts"],
  exit: true,
};
