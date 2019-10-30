import fs from "fs";

/** ファイルが存在するかどうか */
const isExistsFile = (fileName: string) => {
  try {
    fs.statSync(fileName)
    return true;
  } catch (err) {
    return false
  }
}

/** スネークケースをキャメルケースにする */
const Snake2Camel = (str: string): string => str.replace(/_./g, (s) => s.charAt(1).toUpperCase())

/** フォルダがなければ作成する,あったら何もしない */
const mkdir = (dirName: string): boolean => {
  if (!isExistsFile(dirName)) {
    try {
      fs.mkdirSync(dirName, {recursive: true})
    } catch (e) {
      return false;
    }
    return true
  }
  return true
}

/** .を/に変換する */
const replaceAll = (inputStr: string, regex: RegExp = /\./g, replaceValue: string = "/") => inputStr.replace(regex, replaceValue)

/** Javaの組み込み型 */
const JavaPrimitive = ["String", "int", "long", "short", "double", "float", "boolean", "byte", "null"]

export {isExistsFile, Snake2Camel, mkdir, replaceAll, JavaPrimitive}
