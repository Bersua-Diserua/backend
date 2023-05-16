import { Schema, model } from "mongoose"
import { z } from "zod"

export const SYS_CONFIG = "SYS_CONFIG"

const DB_SYS_CONIFG = "sysConfig"

export const sysConfigSchema = z.object({
  adminJids: z.array(z.string()).catch([]),
  internalGroupIds: z.array(z.string()).catch([]),
})

export type SysConfigSchema = z.infer<typeof sysConfigSchema>

const sysConfig = new Schema({
  index: {
    type: String,
    default: SYS_CONFIG,
    unique: true,
  },
  adminJids: [
    {
      type: String,
      default: [],
    },
  ],
  internalGroupIds: [
    {
      type: String,
      default: [],
    },
  ],
})

export const SysConfig = model(DB_SYS_CONIFG, sysConfig, DB_SYS_CONIFG)
