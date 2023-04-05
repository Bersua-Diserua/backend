import { botAttachImage, botGeneralText } from "../../../lib/bot.lib"

import axios from "axios"

export async function sendGeneralText(phone: string, message: string) {
  return await botGeneralText(phone, message)
}

export async function sendAttachMedia(
  phone: string,
  message: string,
  image: string
) {
  return await botAttachImage(phone, message, image)
}

export async function getBase64(url: string): Promise<string> {
  return axios
    .get(url, {
      responseType: "arraybuffer",
    })
    .then((response) => Buffer.from(response.data, "base64").toString("base64"))
}
