import { Router } from "express";

// Services
import { router as AccountServices } from "@services/account";

const router = Router();

router.use("/auth", AccountServices);

export { router as GlobalRouter };
