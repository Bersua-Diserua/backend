import { redisClient } from "../redis"

function getKeyCache(phoneNumber: string) {
  return "live-assist:" + phoneNumber
}

async function add(phoneNumber: string) {
  return redisClient.set(getKeyCache(phoneNumber), "true", "EX", 60 * 60)
}

async function remove(phoneNumber: string) {
  return redisClient.del(getKeyCache(phoneNumber))
}

async function isExist(phoneNumber: string) {
  return redisClient.get(getKeyCache(phoneNumber)).then(Boolean)
}

export function liveAssist() {
  return {
    add,
    remove,
    isExist,
  }
}
