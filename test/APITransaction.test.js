const request = require("supertest");
const express = require("express");
const transactionRouter = require("../router/TransactionRouter");
const { Transaction } = require("../schema/schema");

// 🏗 Tạo app test
const app = express();
app.use(express.json());
app.use("/transactions", transactionRouter);

// 🛠 Mock Transaction Model
jest.mock("../schema/schema", () => ({
  Transaction: {
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  },
}));

describe("🔍 Test API /transactions", () => {
  describe("📌 Tạo giao dịch", () => {
    it("❌ Trả về 400 nếu transaction đã tồn tại", async () => {
      Transaction.findOne.mockResolvedValue(true);

      const res = await request(app)
        .post("/transactions/createTransaction")
        .send({
          userID: "12345",
          type: "income",
          totalMoney: 1000,
          description: "Salary",
          date: "2025-03-23",
          transactionType: "Income",
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Transaction đã tồn tại" });
    });

    it("❌ Trả về 400 nếu thiếu thông tin", async () => {
      const res = await request(app)
        .post("/transactions/createTransaction")
        .send({
          userID: "123",
          totalMoney: 1000,
          description: "Salary",
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: "Transaction thiếu thông tin. Vui lòng cung cấp đủ thông tin!",
      });
    });

    it("❌ Trả về 401 nếu số tiền không hợp lệ", async () => {
      const res = await request(app)
        .post("/transactions/createTransaction")
        .send({
          userID: "12345",
          type: "income",
          totalMoney: -1000,
          description: "Salary",
          date: "2025-03-23",
          transactionType: "Income",
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Số tiền không hợp lệ" });
    });

    it("❌ Trả về 401 nếu loại giao dịch không hợp lệ", async () => {
      const res = await request(app)
        .post("/transactions/createTransaction")
        .send({
          userID: "12345",
          type: "income",
          totalMoney: 1000,
          description: "Salary",
          date: "2025-03-23",
          transactionType: "abc",
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Loại giao dịch không hợp lệ" });
    });
  });

  describe("📌 Sửa giao dịch", () => {
    it("❌ Trả về 404 nếu giao dịch không tồn tại", async () => {
      Transaction.findOne.mockResolvedValue(null);

      const res = await request(app).put("/transactions/editTransaction").send({
        userID: "12345",
        _id: "txn_001",
        type: "income",
        totalMoney: 1000,
        description: "Salary",
        date: "2025-03-23",
        transactionType: "Income",
      });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Giao dịch không tồn tại" });
    });

    it("❌ Trả về 400 nếu số tiền không hợp lệ", async () => {
      const res = await request(app).put("/transactions/editTransaction").send({
        userID: "123",
        _id: "txn_001",
        type: "income",
        totalMoney: -500,
        description: "Test",
        date: "2025-03-23",
        transactionType: "Income",
      });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Số tiền không hợp lệ" });
    });

    it("✅ Cập nhật giao dịch thành công", async () => {
      Transaction.findOne.mockResolvedValue({ _id: "txn_001", userID: "123" });
      Transaction.findOneAndUpdate.mockResolvedValue({
        _id: "txn_001",
        userID: "123",
        type: "income",
        totalMoney: 600,
        description: "Updated Transaction",
        date: "2025-03-23",
        transactionType: "Income",
      });

      const res = await request(app).put("/transactions/editTransaction").send({
        userID: "123",
        _id: "txn_001",
        type: "income",
        totalMoney: 600,
        description: "Updated Transaction",
        date: "2025-03-23",
        transactionType: "Income",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("totalMoney", 600);
    });
  });

  describe("📌 Lấy danh sách giao dịch", () => {
    it("✅ Lấy danh sách giao dịch thành công", async () => {
      Transaction.find.mockResolvedValue([
        {
          userID: "123",
          type: "income",
          totalMoney: 500,
          description: "Salary",
          date: "2025-03-23",
          transactionType: "Income",
        },
      ]);

      const res = await request(app).get("/transactions/transaction");

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("❌ Trả về 500 nếu xảy ra lỗi", async () => {
      Transaction.find.mockRejectedValue(new Error("Lỗi server"));

      const res = await request(app).get("/transactions/transaction");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Lỗi server" });
    });
  });
});
