import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getRecommendations = async (
  customerId: number,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { customerId },
      include: { product: true },
    });

    if (purchases.length === 0) {
      return {
        message:
          "Nenhuma recomendação disponível, pois o cliente não fez nenhuma compra.",
      };
    }

    const purchasedCategories = [
      ...new Set(purchases.map((purchase) => purchase.product.category)),
    ];

    console.log("Compra do cliente:", purchases);
    console.log("Categoria comprada:", purchasedCategories);

    const recommendations = await prisma.product.findMany({
      where: {
        category: { in: purchasedCategories },
        id: { notIn: purchases.map((purchase) => purchase.productId) },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    console.log("Produtos recomendados:", recommendations);

    return {
      page,
      limit,
      data: recommendations,
    };
  } catch (error) {
    console.error("Erro ao buscar recomendações:", error);
    throw new Error("Não é possível buscar recomendações neste momento.");
  }
};
