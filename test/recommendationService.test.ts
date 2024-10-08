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

  it("should recommend products from the same category, excluding already purchased ones", async () => {
    const productA = await prisma.product.findFirst({
      where: { name: "Produto 1" },
    });

    if (!productA) {
      throw new Error("Product not found");
    }

    await prisma.purchase.create({
      data: { customerId: 1, productId: productA.id },
    });

    const recommendations = (await getRecommendations(1)) as Product[]; 

    if (!Array.isArray(recommendations)) {
      throw new Error(
        "Expected an array of recommendations, but received an error message."
      );
    }

    expect(recommendations.length).toBeGreaterThanOrEqual(5);

    expect(recommendations).not.toEqual(
      expect.arrayContaining([{ id: productA.id, name: "Produto 1" }])
    );

    recommendations.forEach((product: Product) => {
      expect(product.category).toBe("Category 1");
    });
  });
});
