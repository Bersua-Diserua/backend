import { MESSAGE_TYPE, TemplateMessage } from "../models/template-message"
import { getBase64, sendAttachMedia, sendGeneralText } from "../controller/send"

import { BadRequest } from "../../../packages/error/index"
import { Router } from "express"
import { config } from "@/packages/config"
import { getDefaultMessage } from "../controller/response"
import { getResponseByCommand } from "../query/find-command"
import { multerMiddleware } from "@/packages/multer"
import { upload } from "@/services/storage"

const router = Router()

// router.post("/session/create", async(req, res) => {

// })

// router.get("/session/check", async(req, res) => {

// })

// TODO: fetch from TemplateMessage for the list
router.get("/default", async (req, res) => {
  const { phone } = req.query

  await sendGeneralText(String(phone), await getDefaultMessage())

  res.success({
    message: await getDefaultMessage(),
  })
})

// avoiding unique character while using get; maybe but idk
router.post("/get-command", async (req, res) => {
  const { phone, commandCode } = req.body
  const response = await getResponseByCommand(commandCode)

  if (!response) {
    await sendGeneralText(String(phone), await getDefaultMessage())
    return res.success({ message: await getDefaultMessage() })
  }

  const { type, message, image } = response

  if (type === MESSAGE_TYPE.Values.IMAGE) {
    const imageB64 = await getBase64(image)
    await sendAttachMedia(phone, message, imageB64)
  }

  if (type === MESSAGE_TYPE.Values.TEXT) {
    await sendGeneralText(phone, message)
  }

  res.success(response)
})

/* -------------------------------------------------------------------------- */
/*                               Portal Utility                               */
/* -------------------------------------------------------------------------- */

// TODO: add validator
router.post("/command", async (req, res) => {
  const { commandCode } = req.body

  const isExist = await TemplateMessage.findOne({ commandCode })
  if (isExist)
    throw new BadRequest(null, "BOT-SERVICES", { context: "Already defined" })

  const templateMessage = new TemplateMessage(req.body)
  await templateMessage.validate()

  res.success({
    id: (await templateMessage.save())._id,
  })
})

router.post("/upload", multerMiddleware.single("image"), async (req, res) => {
  const image = req.file?.buffer
  if (!image) throw new BadRequest("Field image can't empty")

  const fileName = "bot-" + Date.now().toString()
  const uploader = await upload(image, fileName, "bot", [])

  res.success({
    id: uploader._id,
    url: config.IMAGEKIT_ENDPOINT + uploader.filePath,
  })
})

export { router }