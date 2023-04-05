import IoRedis from "ioredis"
import { config } from "@/packages/config"

const redisClient = new IoRedis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
})

console.log({ redisStatus: redisClient.status })

if (config.NODE_ENV === "development") {
  redisClient.on("monitor", (args) => {
    // console.log(args)
  })
}

export { redisClient }
