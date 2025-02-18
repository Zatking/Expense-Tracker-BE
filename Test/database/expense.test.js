const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Expense = require("../../schema/schema").Expense; // Import schema Expense
const Category = require("../../schema/schema").Category; // Import schema Category

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  await Category.syncIndexes();
  await Expense.syncIndexes();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Category.deleteMany(); // Xóa danh mục trước mỗi test
  await Expense.deleteMany(); // Xóa chi tiêu trước mỗi test
});

describe("Expense Model Test", () => {
  it("Tạo Expense thành công", async () => {
    const category = await Category.create({ Name: "Food", StarDate: new Date(), EndDate: new Date(), Money: 500 });

    const expense = await Expense.create({
      Date: new Date(),
      Money: 200,
      Description: "Lunch",
      Category: category._id,
    });

    expect(expense.Money).toBe(200);
    expect(expense.Description).toBe("Lunch");
    expect(expense.Category.toString()).toBe(category._id.toString());
  });

  it("Không tạo Expense nếu thiếu Money", async () => {
    try {
      await Expense.create({
        Description: "Dinner",
        Category: new mongoose.Types.ObjectId(),
      });
    } catch (error) {
      expect(error.errors.Money.message).toBe("Amount is required");
    }
  });

  it("Không tạo Expense với Date không hợp lệ", async () => {
    try {
      await Expense.create({
        Date: "invalid-date",
        Money: 500,
        Description: "Snacks",
      });
    } catch (error) {
      expect(error.message).toContain("Cast to date failed");
    }
  });

  it("Không tạo Expense nếu Date không phải hôm nay", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Ngày hôm qua

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Ngày mai

    // Kiểm tra với ngày hôm qua
    await expect(
      Expense.create({
        Date: yesterday,
        Money: 100,
        Description: "Coffee",
      })
    ).rejects.toThrow("Date must be today");

    // Kiểm tra với ngày mai
    await expect(
      Expense.create({
        Date: tomorrow,
        Money: 250,
        Description: "Dinner",
      })
    ).rejects.toThrow("Date must be today");
  });

  it("Không tạo Expense nếu Category không tồn tại", async () => {
    const invalidCategoryId = new mongoose.Types.ObjectId();

    try {
      await Expense.create({
        Money: 300,
        Description: "Movie tickets",
        Category: invalidCategoryId,
      });
    } catch (error) {
      expect(error.message).toContain("reference");
    }
  });
});
