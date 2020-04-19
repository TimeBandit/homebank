function SmileToHomebankTranslate(
  smileTransaction: SmileTransaction
): HombankTransaction {
  let translatedType: HomebankPaymentType;
  console.info(chalk.white.bgCyan.bold(smileTransaction.Type));
  switch (smileTransaction.Type) {
    case SmilePaymentType.ATM:
      translatedType = HomebankPaymentType.Cash;
      break;
    case SmilePaymentType.Credit:
      translatedType = HomebankPaymentType.ElectronicPayment;
      break;
    case SmilePaymentType.DirectDebit:
      translatedType = HomebankPaymentType.DirectDebit;
      break;
    case SmilePaymentType.Purchase:
      translatedType = HomebankPaymentType.DebitCard;
      break;
    case SmilePaymentType.StandingOrder:
      translatedType = HomebankPaymentType.StandingOrder;
      break;
    case SmilePaymentType.Transfer:
      translatedType = HomebankPaymentType.Transfer;
      break;
    default:
      throw new Error("unknow smile transation type");
  }

  const amount =
    parseFloat(smileTransaction["Money In"]) ||
    -1 * parseFloat(smileTransaction[" Money Out"]); // ! trim column header names

  console.log("money in is ", typeof smileTransaction["Money In"]);
  console.log("money out is ", typeof smileTransaction[" Money Out"]);
  if (isNaN(amount)) {
    throw new Error(
      `Cant transform ${JSON.stringify(smileTransaction, null, 2)}`
    );
  }

  return {
    date: smileTransaction.Date,
    payment: translatedType,
    info: "",
    payee: "",
    memo: smileTransaction.Description,
    amount,
    category: "",
    tags: ""
  };
}

import chalk from "chalk";
import * as csv from "fast-csv";
import * as fs from "fs";
import { HombankTransaction } from "./types/HombankTransaction";
import { HomebankPaymentType } from "./types/HomebankPaymentType";
import { SmilePaymentType } from "./types/SmilePaymentType";
import { SmileTransaction } from "./types/SmileTransaction";
var path = require("path");
var absolutePath = path.resolve("src/data/089286_17223210_2020-01-19.csv");

const newData: HombankTransaction[] = [];

fs.createReadStream(absolutePath)
  .pipe(csv.parse({ headers: true }))
  .on("error", (error: Error) => console.error(error))
  .transform(SmileToHomebankTranslate)
  .on("data", (row: HombankTransaction) => newData.push(row))
  .on("end", (rowCount: number) => {
    // console.log(`Parsed ${rowCount} rows`)
    console.log(newData.length);
    console.log(newData);

    csv
      .writeToPath(
        path.resolve("./src/data", "089286_17223210_2020-01-19-converted.csv"),
        newData,
        {
          headers: true,
          delimiter: ";"
        }
      )
      .on("error", err => console.error(err))
      .on("finish", () => console.log("Done writing."));
  });
