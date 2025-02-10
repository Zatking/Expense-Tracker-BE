const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Category = require("../models/Category");
const User = require("../models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  await User.syncIndexes(); // Đảm bảo index User được cập nhật
  await Category.syncIndexes(); // Đảm bảo index Category được cập nhật
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany(); // Xóa User trước mỗi test
  await Category.deleteMany(); // Xóa Category trước mỗi test
});

describe("Category Model Test", () => {
  it("Tạo category thành công", async () => {
    const user = await User.create({ userName: "Alice", password: "123456" });
    const category = await Category.create({
      User: user._id,
      Name: "Groceries",
      StarDate: new Date("2024-02-01"),
      EndDate: new Date("2024-02-28"),
      Money: 500,
      Description: "Monthly groceries budget",
    });

    expect(category.Name).toBe("Groceries");
    expect(category.Money).toBe(500);
    expect(category.User.toString()).toBe(user._id.toString());
  });

  it("Không tạo category nếu thiếu Name", async () => {
    try {
      await Category.create({
        StarDate: new Date("2024-02-01"),
        EndDate: new Date("2024-02-28"),
        Money: 500,
      });
    } catch (error) {
      expect(error.errors.Name.message).toBe("Name is required");
    }
  });

  it("Không tạo category nếu thiếu Money", async () => {
    try {
      await Category.create({
        Name: "Groceries",
        StarDate: new Date("2024-02-01"),
        EndDate: new Date("2024-02-28"),
      });
    } catch (error) {
      expect(error.errors.Money.message).toBe("Money is required");
    }
  });

  it("Không tạo category nếu thiếu StarDate hoặc EndDate", async () => {
    try {
      await Category.create({
        Name: "Groceries",
        EndDate: new Date("2024-02-28"),
        Money: 500,
      });
    } catch (error) {
      expect(error.errors.StarDate.message).toBe("Path `StarDate` is required.");
    }

    try {
      await Category.create({
        Name: "Groceries",
        StarDate: new Date("2024-02-01"),
        Money: 500,
      });
    } catch (error) {
      expect(error.errors.EndDate.message).toBe("Path `EndDate` is required.");
    }
  });

  it("Không tạo category nếu User không hợp lệ", async () => {
    try {
      await Category.create({
        User: new mongoose.Types.ObjectId(),
        Name: "Groceries",
        StarDate: new Date("2024-02-01"),
        EndDate: new Date("2024-02-28"),
        Money: 500,
      });
    } catch (error) {
      expect(error.message).toContain("reference");
    }
  });

  it("Không tạo category nếu StarDate không phải ngày hôm nay", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Lấy ngày hôm qua
  
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Lấy ngày mai
  
    // Kiểm tra với ngày hôm qua
    await expect(
      Category.create({
        Name: "Utilities",
        StarDate: yesterday,
        EndDate: new Date(),
        Money: 200,
      })
    ).rejects.toThrow("StarDate must be today");
  
    // Kiểm tra với ngày mai
    await expect(
      Category.create({
        Name: "Rent",
        StarDate: tomorrow,
        EndDate: new Date(),
        Money: 1000,
      })
    ).rejects.toThrow("StarDate must be today");
  });
  
});
