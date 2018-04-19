const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const CsvReadableStream = require("csv-reader");
const verifier = require("email-verify");

let filePath;
if (process.argv[2]) {
  filePath = process.argv[2];
} else {
  console.error(chalk.bold.redBright("Please provide file path"));
  return;
}

const inputStream = fs.createReadStream(path.resolve(__dirname, filePath), "utf8");
const writeStream = fs.createWriteStream(path.resolve(__dirname, "output.csv"), "utf8");
writeStream.write("email, success\n");
inputStream.pipe(CsvReadableStream()).on("data", async row => {
  if (row.length > 0 && !!row[0])
    console.log(chalk.bold.bgBlueBright("Current Email"), chalk.bold.blueBright(row[0]));
  await verifier.verify(row[0], (err, info) => {
    if (err) {
      writeStream.write(row[0] + ", " + false + "\n");
      console.error(chalk.bold.redBright(err));
    } else writeStream.write(row[0] + ", " + info.success + "\n");
  });
});
