const { generateContent } = require("../controller/AiService");
const { Transaction } = require("../schema/schema");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 🛠️ Mock Transaction Model (MongoDB)
jest.mock("../schema/schema", () => ({
  Transaction: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

// 🛠️ Mock GoogleGenerativeAI
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

describe("Test generateContent function", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("Trả về mã 400 nếu thiếu userPrompt", async () => {
    req.body = { userPrompt: "", userID: "123" };

    await generateContent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Prompt không được để trống." });
  });

  it("Trả về mã 400 nếu thiếu userID", async () => {
    req.body = { userPrompt: "Mua sắm tại Coopmart" };

    await generateContent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "UserID không hợp lệ." });
  });
});