import {
  sendMessageGroup,
  sendMessageText,
} from "../../../packages/rabbitmq/index"

import axios from "axios"
import { sendMessageImage } from "@/packages/rabbitmq"

export async function sendGeneralText(phone: string, message: string) {
  return sendMessageText(phone, message)
}

export async function sendAttachMedia(
  phone: string,
  message: string,
  image: string
) {
  return sendMessageImage(phone, message, image)
}

export async function sendGroupText(message: string) {
  return sendMessageGroup(message)
}

export async function getBase64(url: string): Promise<string> {
  return axios
    .get(url, {
      responseType: "arraybuffer",
    })
    .then((response) => Buffer.from(response.data, "base64").toString("base64"))
}
