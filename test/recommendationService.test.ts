import { getRecommendations } from "../src/services/recommendationService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Product = {
  id: number;
  name: string;
  category: string;
};

describe("getRecommendations", () => {
  beforeAll(async () => {
    await prisma.product.createMany({
      data: [
        { name: "Produto 1", category: "Category 1" },
        { name: "Produto 2", category: "Category 1" },
        { name: "Produto 3", category: "Category 1" },
        { name: "Produto 4", category: "Category 1" },
        { name: "Produto 5", category: "Category 1" },
        { name: "Produto 6", category: "Category 1" },
        { name: "Produto 7", category: "Category 2" },
        { name: "Produto 8", category: "Category 2" },
        { name: "Produto 9", category: "Category 2" },
        { name: "Produto 10", category: "Category 2" },
      ],
    });
  });

  it("Recomendar produtos da mesma categoria, excluindo os já comprados", async () => {
    const productA = await prisma.product.findFirst({
      where: { name: "Produto 1" },
    });

    if (!productA) {
      throw new Error("Product not found");
    }

    await prisma.purchase.create({
      data: { customerId: 1, productId: productA.id },
    });

    // serviço agora com paginação default (page 1, limit 10)
    const recommendations = await getRecommendations(1, 1, 10);

    // Verificar se a estrutura de resposta está correta
    expect(recommendations).toHaveProperty("page", 1);
    expect(recommendations).toHaveProperty("limit", 10);
    expect(recommendations).toHaveProperty("data");

    const recommendationData = recommendations.data as Product[];

    // verificando se a quantidade de produtos recomendados é suficiente
    expect(recommendationData.length).toBeGreaterThanOrEqual(5);

    // verificando se o produto comprado não esteja nas recomendações
    expect(recommendationData).not.toEqual(
      expect.arrayContaining([{ id: productA.id, name: "Produto 1" }])
    );

    // verificando se recomendações são da mesma categoria comprada
    recommendationData.forEach((product: Product) => {
      expect(product.category).toBe("Category 1");
    });
  });

  it("paginar as recomendações", async () => {
    const productB = await prisma.product.findFirst({
      where: { name: "Produto 2" },
    });

    if (!productB) {
      throw new Error("Product not found");
    }

    await prisma.purchase.create({
      data: { customerId: 2, productId: productB.id },
    });

    const paginatedRecommendations = await getRecommendations(2, 1, 2);

    expect(paginatedRecommendations).toHaveProperty("page", 1);
    expect(paginatedRecommendations).toHaveProperty("limit", 2);
    expect(paginatedRecommendations).toHaveProperty("data");

    const paginatedData = paginatedRecommendations.data as Product[];

    expect(paginatedData.length).toBe(2);

    expect(paginatedData).not.toEqual(
      expect.arrayContaining([{ id: productB.id, name: "Produto 2" }])
    );
  });
});
