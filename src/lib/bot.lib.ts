import axios, { AxiosResponse } from "axios"

import { config } from "@/packages/config"

const axiosBot = axios.create({ baseURL: config.BOT_SERVER })

export const botGeneralText = (
  phone: string,
  message: string
): Promise<AxiosResponse> =>
  new Promise((resolve, reject) => {
    axiosBot
      .post("/general-text", {
        phone,
        message,
      })
      .then((val) => resolve(val))
      .catch((err) => reject(err))
  })

export const botAttachImage = (
  phone: string,
  message: string,
  image: string
): Promise<AxiosResponse> =>
  new Promise((resolve, reject) => {
    axiosBot
      .post("/attach-image", {
        phone,
        message,
        image,
      })
      .then((val) => resolve(val))
      .catch((err) => reject(err))
  })
