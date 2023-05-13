import amq from "amqplib"
import config from "../config"

let amqConnection!: amq.Connection
let channel!: amq.Channel

export async function connectAmq() {
  amqConnection = await amq.connect(config.RABBITMQ_URI)

  return amqConnection
}

connectAmq().then(createChannel).catch(console.error)

export async function createChannel() {
  channel = await amqConnection.createChannel()
  await channel.assertQueue("task_backend", {
    durable: true,
  })
  console.log("Estabilished Broker")
}

export function sendMessageText(phoneNumber: string, message: string) {
  return channel.sendToQueue(
    "task_backend",
    Buffer.from(
      JSON.stringify({
        command: "MESSAGE.TEXT",
        payload: {
          phoneNumber,
          message,
        },
      })
    )
  )
}

export function sendMessageTextPriority(
  phoneNumber: string,
  message: string,
  priority: number
) {
  return channel.sendToQueue(
    "task_backend",
    Buffer.from(
      JSON.stringify({
        command: "MESSAGE.TEXT",
        payload: {
          phoneNumber,
          message,
        },
      })
    ),
    { priority }
  )
}

export function sendMessageImage(
  phoneNumber: string,
  message: string,
  image?: string
) {
  return channel.sendToQueue(
    "task_backend",
    Buffer.from(
      JSON.stringify({
        command: "MESSAGE.IMAGE",
        payload: {
          phoneNumber,
          message,
          image,
        },
      })
    )
  )
}

export function sendMessageGroup(message: string) {
  return channel.sendToQueue(
    "task_backend",
    Buffer.from(
      JSON.stringify({
        command: "MESSAGE.GROUP",
        payload: {
          message,
        },
      })
    )
  )
}
