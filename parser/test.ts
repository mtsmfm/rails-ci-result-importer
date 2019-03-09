import { generate } from "pegjs";
import { readFileSync, mkdirSync, existsSync, writeFileSync } from "fs";

const TravisResultParser = generate(
  readFileSync("travis_result.pegjs").toString()
);
const RailsCiParser = generate(readFileSync("rails_ci.pegjs").toString(), {
  trace: false
});

import * as request from "request-promise";
import { join, relative } from "path";

const jobId = process.argv[2];

const tmpDir = join(__dirname, "tmp");
const jobDir = join(tmpDir, jobId);

[tmpDir, jobDir].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
});

const rawLogPath = join(jobDir, "raw.log");

(async () => {
  if (!existsSync(rawLogPath)) {
    const body = await request(`https://api.travis-ci.org/jobs/${jobId}/log`, {
      followAllRedirects: true
    });
    writeFileSync(rawLogPath, body);
  }

  const rawLog = readFileSync(rawLogPath).toString();

  const railsCiResult = (TravisResultParser.parse(rawLog) as string[]).find(
    command => command.includes("[Travis CI]")
  )!;

  console.log(
    "Writing result to",
    relative(join(__dirname, ".."), join(jobDir, "railsCiResult.log"))
  );
  writeFileSync(join(jobDir, "railsCiResult.log"), railsCiResult);

  console.log(
    "Writing result to",
    relative(join(__dirname, ".."), join(jobDir, "railsCiResult.json"))
  );
  writeFileSync(
    join(jobDir, "railsCiResult.json"),
    JSON.stringify(RailsCiParser.parse(railsCiResult), null, 2)
  );
})();
