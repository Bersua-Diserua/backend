import amq from "amqplib"
import config from "../config"

let amqConnection!: amq.Connection
let channel!: amq.Channel

export async function connectAmq() {
  amqConnection = await amq.connect(config.RABBITMQ_URI)

  return amqConnection
}

connectAmq()
  .then(() => console.log("Estabilished Broker"))
  .catch(console.error)

export async function createChannel() {
  channel = await amqConnection.createChannel()
  await channel.assertQueue("task_backend", {
    durable: true,
  })
}

export function sendMessage(phoneNumber: string, message: string) {
  return channel.sendToQueue(
    "task_backend",
    Buffer.from(
      JSON.stringify({
        command: "MESSAGE.SINGLE",
        payload: {
          phoneNumber,
          message,
        },
      })
    )
  )
}
