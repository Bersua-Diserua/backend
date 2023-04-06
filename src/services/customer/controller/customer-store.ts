import { redisClient } from "@/packages/redis"
import type IoRedis from "ioredis"
import { Customer } from "../model"

type CustomerProps = {
  id: string
  name: string
  phoneNumber: string
}

class CustomerStore {
  private KEY = "customer:"
  private EX = 60 * 60 * 24

  constructor(private redis: IoRedis) {}

  private keyBuilder(phoneNumber: string) {
    return this.KEY + phoneNumber
  }

  private async _getCache(phoneNumber: string) {
    const cache = await this.redis.get(this.keyBuilder(phoneNumber))
    if (!cache) return null
    return JSON.parse(cache) as CustomerProps
  }

  private async _setCache(phoneNumber: string, customer: CustomerProps) {
    await this.redis.set(
      this.keyBuilder(phoneNumber),
      JSON.stringify(customer),
      "EX",
      this.EX
    )
  }

  public async invalidate(phoneNumber: string) {
    await this.redis.del(this.keyBuilder(phoneNumber))
  }

  public async invalidateStore() {
    const keys = await this.redis.keys(this.KEY)
    await this.redis.del(keys)
  }

  public async obtainFromDB(phoneNumber: string) {
    let cust = await Customer.findOne({
      phoneNumber,
    })

    if (!cust) {
      console.log("New customer")
      cust = await Customer.create({
        phoneNumber,
      })
    }

    return cust
  }

  public async obtainByPhone(phoneNumber: string) {
    let cache = await this._getCache(phoneNumber)
    if (!cache) {
      await this.obtainFromDB(phoneNumber).then((x) => {
        const { name = "no-name", phoneNumber, _id } = x
        cache = {
          id: _id.toString(),
          name,
          phoneNumber,
        }
        return this._setCache(phoneNumber, {
          id: _id.toString(),
          name,
          phoneNumber,
        })
      })
    }

    if (!cache) throw new Error("Something error when obtaining customer")
    return cache
  }
}

const customerStore = new CustomerStore(redisClient)

export { customerStore }
