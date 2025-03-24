const request = require("supertest");
const express = require("express");
const aiRouter = require("../router/AIRouter"); // Import router chứa API cần test
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 🏗 Tạo app test
const app = express();
app.use(express.json()); // Middleware để parse JSON
app.use("/ai", aiRouter); // Gắn router vào app

// 🛠 Mock Transaction Model (MongoDB)
jest.mock("../schema/schema", () => ({
  Transaction: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

// 🛠 Mock GoogleGenerativeAI
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn(() =>
            JSON.stringify({
              transaction: {
                type: "Mua Sắm",
                totalMoney: 200000,
                description: "Mua đồ tại Coopmart",
                date: "2024-03-24T17:00:00.000Z",
                transactionType: "Expense",
              },
            })
          ),
        },
      }),
    })),
  })),
}));

describe("🔍 Test API /ai/AI", () => {
  it("❌ Trả về 400 nếu thiếu userPrompt", async () => {
    const res = await request(app).post("/ai/AI").send({ userID: "123" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Prompt không được để trống." });
  });

  it("❌ Trả về 400 nếu thiếu userID", async () => {
    const res = await request(app).post("/ai/AI").send({ userPrompt: "Mua sắm tại Coopmart" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "UserID không hợp lệ." });
  });

  it("❌ Trả về 500 nếu AI lỗi", async () => {
    jest.mock("@google/generative-ai", () => ({
      GoogleGenerativeAI: jest.fn(() => ({
        getGenerativeModel: jest.fn(() => ({
          generateContent: jest.fn().mockRejectedValue(new Error("Lỗi AI")),
        })),
      })),
    }));

    const res = await request(app)
      .post("/ai/AI")
      .send({ userPrompt: "Mua cơm", userID: "123" });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error:"Lỗi khi xử lý AI: Transaction is not a constructor" });
  });
});
