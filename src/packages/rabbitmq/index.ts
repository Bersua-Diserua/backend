import amq from "amqplib"
import config from "../config"

let amqConnection!: amq.Connection

export async function connectAmq() {
  amqConnection = await amq.connect(config.RABBITMQ_URI)
  return amqConnection
}
