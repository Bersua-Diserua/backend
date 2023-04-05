import "express-async-errors"

import { GlobalRouter } from "./routes"
import config from "./packages/config"
import cors from "cors"
import { errorHandler } from "./packages/utils/error-handler"
import express from "express"
import { tokenAssignerMiddleware } from "./packages/utils/token-assigner"
import { wrapperResponseSuccess } from "./packages/utils"

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(
  express.json({
    limit: "100mb",
  })
)
app.use(wrapperResponseSuccess)
app.use(tokenAssignerMiddleware)

app.use(GlobalRouter)

app.get("/", (req, res) => {
  res.success({
    test: "Bersua diserua",
  })
})

app.use("*", (req, res) => {
  res.status(400)
  res.success({
    url: req.url,
    message: "Not Found",
  })
})

app.use(errorHandler)

export async function runServer() {
  app.listen(config.PORT, () => {
    console.log(`Listening on port: `, config.PORT)
  })
  return app
}

export { app }
