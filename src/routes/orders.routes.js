import { Router } from "express";
import { getUserPayment } from "../controllers/payment.controller.js";


const router = Router();


router.get("/user-payments",getUserPayment)

export default router;