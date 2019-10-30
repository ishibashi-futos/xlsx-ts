import {utils} from "xlsx";
import XLSX from "xlsx"
import fs from "fs";

const fileName = "./assets/test.xlsx"
const sheetNames = [
  "sheet1"
]

let isExistsFile = (fileName: string) => {
  try {
    fs.statSync(fileName)
    return true;
  } catch (err) {
    return false
  }
}

if (!isExistsFile(fileName)) {
  let wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "SampleExcelFiles",
    Subject: "Sample",
    Author: "hogehoge",
    CreatedDate: new Date()
  }
  
  wb.SheetNames.push(sheetNames[0])
  
  let data = [
    ["javaType", "varName", "japaneseName", "description", "memberof"],
    ["int", "user_id", "ユーザId", "ユーザの識別子", "-"],
    ["String", "user_Name", "ユーザ名", "ユーザ名", "-"]
  ]
  
  let ws = XLSX.utils.aoa_to_sheet(data);
  
  wb.Sheets[sheetNames[0]] = ws;
  
  XLSX.writeFile(wb, fileName);
}

/** workbook/worksheetsの読み込み */
const book = XLSX.readFile(fileName);
const sheet1 = book.Sheets[sheetNames[0]];

/** セル範囲の取得 */
const range = sheet1["!ref"] as string
const decodeRange = utils.decode_range(range)
console.log(decodeRange)

/** スネークケースをキャメルケースにする */
const Snake2Camel = (str: string): string => str.replace(/_./g, (s) => s.charAt(1).toUpperCase())

/** セル範囲のループ処理 */
type DataType = {
  javaType: string
  varName: string
  japaneseName: string
  description: string
  memberof: string
}
let arr: DataType[] = []
for (let rowIndex = decodeRange.s.r; rowIndex <= decodeRange.e.r; rowIndex++) {
  let data: DataType = {
    javaType: "",
    varName: "",
    japaneseName: "",
    description: "",
    memberof: ""
  }
  for (let colIndex = decodeRange.s.c; colIndex <= decodeRange.e.c; colIndex++) {
    const address = utils.encode_cell({r: rowIndex, c: colIndex})
    const cell = sheet1[address]
    if (typeof cell !== undefined && typeof cell.v !== "undefined" && rowIndex !== 0) {
      switch (colIndex) {
        case 0:
          data.javaType = cell.v
          break
        case 1:
          data.varName = Snake2Camel(cell.v)
          break
        case 2:
          data.japaneseName = cell.v
          break
        case 3:
          data.description = cell.v
          break
        case 4:
          data.memberof = cell.v
          break
        default:

      }
    }
  }
  arr.push(data)
}

arr.forEach((data: DataType) => {
  console.log(data)
})