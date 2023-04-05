import amq from "amqplib"
import config from "../config"

let amqConnection!: amq.Connection

export async function connectAmq() {
  amqConnection = await amq.connect(config.RABBITMQ_URI)
  const channel = await amqConnection.createChannel()
  await channel.assertQueue("task_backend", {
    durable: true,
  })

  channel.sendToQueue(
    "task_backend",
    Buffer.from(
      JSON.stringify({
        command: "MESSAGE.SINGLE",
        payload: {
          phoneNumber: "628985665498",
          message: "HAHAHA",
        },
      })
    )
  )
  return amqConnection
}

connectAmq()
  .then(() => console.log("Estabilished Broker"))
  .catch(console.error)
