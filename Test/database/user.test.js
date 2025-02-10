const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../schema/schema").User;

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  await User.syncIndexes(); // Đảm bảo index được áp dụng
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany(); // Xóa dữ liệu trước mỗi test
});

describe("User Model Test", () => {
  it("Tạo user thành công", async () => {
    const user = await User.create({ userName: "Alice", password: "123456" });
    expect(user.userName).toBe("Alice");
    expect(user.password).toBe("123456");
  });

  it("Không tạo user khi thiếu userName", async () => {
    try {
      await User.create({ password: "123456" });
    } catch (error) {
      expect(error.errors.userName.message).toBe("Username is required");
    }
  });

  it("Không tạo user khi thiếu password", async () => {
    try {
      await User.create({ userName: "Alice" });
    } catch (error) {
      expect(error.errors.password.message).toBe("Password is required");
    }
  });

  it("Không tạo user với userName trùng lặp", async () => {
    await User.create({ userName: "Alice", password: "123456" });

    try {
      await User.create({ userName: "Alice", password: "654321" });
    } catch (error) {
      expect(error).toMatchObject({ code: 11000 }); // Lỗi Duplicate Key
    }
  });
});
