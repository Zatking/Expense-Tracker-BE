const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Income = require("../models/Income"); // Import schema Income
const Category = require("../models/Category"); // Import schema Category

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  await Category.syncIndexes();
  await Income.syncIndexes();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Category.deleteMany(); // Xóa danh mục trước mỗi test
  await Income.deleteMany(); // Xóa thu nhập trước mỗi test
});

describe("Income Model Test", () => {
  it("Tạo Income thành công", async () => {
    const category = await Category.create({ Name: "Salary", StarDate: new Date(), EndDate: new Date(), Money: 5000 });

    const income = await Income.create({
      Date: new Date(),
      Money: 1000,
      Description: "Monthly salary",
      Category: category._id,
    });

    expect(income.Money).toBe(1000);
    expect(income.Description).toBe("Monthly salary");
    expect(income.Category.toString()).toBe(category._id.toString());
  });

  it("Không tạo Income nếu thiếu Money", async () => {
    try {
      await Income.create({
        Description: "Bonus payment",
        Category: new mongoose.Types.ObjectId(),
      });
    } catch (error) {
      expect(error.errors.Money.message).toBe("Amount is required");
    }
  });

  it("Không tạo Income với Date không hợp lệ", async () => {
    try {
      await Income.create({
        Date: "invalid-date",
        Money: 500,
        Description: "Gift",
      });
    } catch (error) {
      expect(error.message).toContain("Cast to date failed");
    }
  });

  it("Không tạo Income nếu Category không tồn tại", async () => {
    const invalidCategoryId = new mongoose.Types.ObjectId();

    try {
      await Income.create({
        Money: 1500,
        Description: "Project income",
        Category: invalidCategoryId,
      });
    } catch (error) {
      expect(error.message).toContain("reference");
    }
  });

  it("Không tạo Income nếu Date không phải hôm nay", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Ngày hôm qua
  
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Ngày mai
  
    // Kiểm tra với ngày hôm qua
    await expect(
      Income.create({
        Date: yesterday,
        Money: 300,
        Description: "Freelance payment",
      })
    ).rejects.toThrow("Date must be today");
  
    // Kiểm tra với ngày mai
    await expect(
      Income.create({
        Date: tomorrow,
        Money: 400,
        Description: "Bonus payment",
      })
    ).rejects.toThrow("Date must be today");
  });
  
});
