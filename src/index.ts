import "./polyfill"
import "@packages/config"
import "@packages/rabbitmq"

import { mongoConnect } from "./packages/mongodb"
import { runServer } from "./server"

mongoConnect().then(runServer).catch(console.error)
