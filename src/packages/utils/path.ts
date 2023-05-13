export function getDirPath() {
  return process.cwd()
}

export function getFileFromDir(filename: string) {
  return getDirPath() + "/" + filename
}
