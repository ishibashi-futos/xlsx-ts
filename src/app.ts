import {utils} from "xlsx";
import XLSX from "xlsx"
import fs from "fs";
import {isExistsFile, Snake2Camel, mkdir, replaceAll} from "./util"

const fileName = "./assets/test.xlsx"
const sheetNames = [
  "sheet1"
]

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
    ["int", "user_id", "ユーザId", "ユーザの識別子", "UserData"],
    ["String", "user_Name", "ユーザ名", "ユーザ名", "UserData"],
    ["CalendarDate", "calendar_date_time_T", "カレンダー日時", "カレンダー日時クラス", "UserData"],
    ["int", "year", "年", "年", "CalendarDate"],
    ["int", "month", "月", "月", "CalendarDate"],
    ["int", "day", "日", "日", "CalendarDate"],
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

/** セル範囲のループ処理 */
type DataType = {
  javaType: string
  varName: string
  japaneseName: string
  description: string
  memberof: string
}
let arr: DataType[] = []
let classData = new Map<string, DataType[]>();
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
  if (!classData.has(data.memberof)) {
    let dataTypes: DataType[] = [];
    dataTypes.push(data)
    classData.set(data.memberof, dataTypes)
  } else {
    let dataTypes = classData.get(data.memberof)
    dataTypes!.push(data);
  }
}
const PKG_BASE = "com.example.samplewebapp"
const SUBSYSTEM_ID = "app"
const PROGRAM_ID = "test1"

classData.forEach((v: DataType[], key: string) => {
  if (key == "") return
  const members = v.map((v) => {
    return `\tpublic final ${v.javaType} ${v.varName};`
  }).join("\n")

  const allArgs = v.map((v) => `${v.javaType} ${v.varName}`).join(", ")
  const set = v.map((v) => {
    return `\t\tthis.${v.varName} = ${v.varName};`
  }).join("\n")

  const fileData = `package ${PKG_BASE}.${SUBSYSTEM_ID}.${PROGRAM_ID};

public class ${key} {
${members}

\tpublic ${key}(${allArgs}) {
${set}
\t}
}`
  const dirName = `./target/${replaceAll(PKG_BASE)}/${SUBSYSTEM_ID}/${PROGRAM_ID}`
  mkdir(dirName);
  fs.writeFile(`${dirName}/${key}.java`, fileData, (err) => {
    if (err) {
      console.error("error: ", err)
    }
  })
})
