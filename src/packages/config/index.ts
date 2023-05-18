import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const config = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).optional(),
    PORT: z.preprocess((val) => Number(val), z.number()),
    SECRET: z.string(),
    MONGO_URI: z.string().url(),
    IMAGEKIT_PRIVATE_KEY: z.string(),
    IMAGEKIT_PUBLIC_KEY: z.string(),
    IMAGEKIT_ENDPOINT: z.string().url(),
    RABBITMQ_URI: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.preprocess((val) => Number(val), z.number()),
    BOT_SERVER: z.string(),
    DOMAIN: z.string().url(),
  })
  .parse(process.env)

console.log({ config })

export { config }
export default config
