import { Command, flags } from "@oclif/command";
import * as YAML from "js-yaml";
import * as fs from "fs";
import * as jsonRefs from "json-refs";

class Ryr extends Command {
  static description = "describe the command here";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    outputFormat: flags.string({
      char: "f",
      description: "output file format",
    }),
    outputFile: flags.string({
      char: "o",
      default: "resolved",
      description: "output file name",
    }),
  };
  static args = [
    {
      name: "inputFile",
      required: true,
      description: "The YAML file you're trying to solve",
    },
  ];

  async run() {
    const { args, flags } = this.parse(Ryr);
    const inputFile: string = args.inputFile;
    const outputFile: string = args.outputFile ? args.outputFile : "resolved";

    if (!fs.existsSync(inputFile)) {
      console.error("ERROR: File does not exist. (" + inputFile + ")");
      process.exit(1);
    }

    // const root = YAML.safeLoad(fs.readFileSync(inputFile).toString());

    fs.writeFileSync("tmp.yaml", YAML.safeDump({ $ref: inputFile }), "utf8");
    const root = YAML.safeLoad(fs.readFileSync("tmp.yaml").toString());

    const options: jsonRefs.JsonRefsOptions = {
      filter: ["relative", "remote", "invalid"],
      // location: "./" + inputFile,
      resolveCirculars: true,
      includeInvalid: true,
      loaderOptions: {
        processContent: (res: any, callback: any) => {
          callback(undefined, YAML.safeLoad(res.text));
        },
      },
    };

    jsonRefs.clearCache();

    jsonRefs
      .resolveRefs(root, options)
      .then((results: jsonRefs.ResolvedRefsResults) => {
        // Chaeck Invalid Ref
        if (Object.keys(jsonRefs.findRefs(results.resolved)).length) {
          Object.keys(jsonRefs.findRefs(results.resolved)).forEach(
            (invalidFile) => {
              const invalidRefs = jsonRefs.findRefs(results.resolved)[
                invalidFile
              ];

              if (invalidRefs !== undefined) {
                console.error(
                  "Can't resolved: " + invalidRefs.uri + " in " + invalidFile
                );
              }
            }
          );
          process.exit(1);
        }

        // Output to yaml
        if (flags.outputFormat === "yaml") {
          console.log(YAML.safeDump(results.resolved, { noRefs: true }));
          fs.writeFile(
            outputFile + ".yaml",
            YAML.safeDump(results.resolved, { noRefs: true }),
            "utf8",
            (err) => {
              if (err) {
                fs.unlink("tmp.yaml", (err) => {
                  if (err) throw err;
                });
                console.error(err.message);
                process.exit(1);
              }
            }
          );
          fs.unlink("tmp.yaml", (err) => {
            if (err) throw err;
          });
          // Output to json
        } else if (flags.outputFormat === "json") {
          console.log(JSON.stringify(results.resolved, null, 2));
          fs.writeFile(
            outputFile + ".json",
            JSON.stringify(results.resolved, null, 2),
            "utf8",
            (err) => {
              if (err) {
                console.error(err.message);
                process.exit(1);
              }
            }
          );
        }
      })
      .catch((reason) => {
        console.log(reason.stack);
      });
  }
}

export = Ryr;
