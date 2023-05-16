import csv from "csv"
import fs from "fs"
import { getFileFromDir } from "../utils/path"
import { Customer } from "@/services/customer/model"

const FILE_NAME = "cust.csv"

const a = new Map()

fs.createReadStream(getFileFromDir(FILE_NAME))
  .pipe(csv.parse({ delimiter: "," }))
  .on("data", function (row) {
    if (row instanceof Error) return
    else {
      a.set(row[2], {
        name: row[0],
        telp: row[2],
      })
    }
  })
  .on("finish", () => {
    console.log("FINISH")
    console.log(a.size)
  })
  .on("error", console.error)
