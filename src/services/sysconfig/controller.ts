import { redisClient } from "@/packages/redis"
import { SYS_CONFIG, SysConfig, sysConfigSchema } from "./model"

async function initSysConfig() {
  return new SysConfig({
    index: SYS_CONFIG,
    adminJids: [],
    internalGroupIds: [],
  })
}

async function getSysConfigFromDB() {
  let sysConfig = await SysConfig.findOne({ index: SYS_CONFIG })
  if (!sysConfig) sysConfig = await initSysConfig()
  return sysConfig
}

function getKeyCache() {
  return "CONFIG:SYS_CONFIG"
}

export function getSysConfigFromCache() {
  return redisClient.get(getKeyCache())
}

export async function getSysConfig() {
  let cache = await getSysConfigFromCache()
  if (!cache)
    cache = await getSysConfigFromDB().then((x) => {
      return redisClient
        .set(getKeyCache(), JSON.stringify(sysConfigSchema.parse(x)))
        .then(getSysConfigFromCache)
    })

  return sysConfigSchema.parse(JSON.parse(cache!))
}
