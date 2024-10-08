import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getRecommendations as recommendationService } from "../services/recommendationService";

const prisma = new PrismaClient();

export const createPurchase = async (req: Request, res: Response) => {
  const { customerId, productId } = req.body;

  try {
    
    const purchase = await prisma.purchase.create({
      data: {
        customerId,
        productId,
      },
    });
    res.json(purchase);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao criar a compra." });
  }
};

export const getRecommendations = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  try {
    const recommendations = await recommendationService(parseInt(customerId));

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter recomendações." });
  }
};
