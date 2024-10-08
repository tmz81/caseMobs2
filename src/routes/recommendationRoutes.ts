import { Router } from "express";
import {
  createPurchase,
  getRecommendations,
} from "../controllers/recommendationController";

const router = Router();

router.post("/purchases", createPurchase);

router.get("/recommendations/:customerId", getRecommendations);

export default router;
