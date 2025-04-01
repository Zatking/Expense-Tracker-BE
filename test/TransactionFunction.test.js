const {
  createTransaction,
  editTransaction,
  getTransactionUser,
  getTransaction,
  getExpenseTransaction,
  getIncomeTransaction,
  getTransactionByMonth,
} = require("../controller/Transaction");

const Transaction = require("../schema/schema").Transaction;

jest.mock("../schema/schema", () => ({
  Transaction: {
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn(),
  },
}));

describe("create Transaction", () => {
  it(" Trả về mã 400 nếu như transaction đã tồn tại", async () => {
    const req = {
      body: {
        userID: "12345",
        type: "income",
        totalMoney: 1000,
        description: "Salary",
        date: "2025-03-23",
        transactionType: "Income",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Transaction.findOne.mockResolvedValue(true);
    await createTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Transaction đã tồn tại" });
  });

  it("Trả về mã 401 nếu như mà Transactin thiếu thông tin ", async () => {
    const req = {
      body: { userID: "123", totalMoney: 1000, description: "Salary" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Transaction thiếu thông tin. Vui lòng cung cấp đủ thông tin!",
    });
  });

  it("Trả về mã 401 nếu như mà số tiền không hợp lệ ", async () => {
    const req = {
      body: {
        userID: "12345",
        type: "income",
        totalMoney: -1000,
        description: "Salary",
        date: "2025-03-23",
        transactionType: "Income",
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Số tiền không hợp lệ" });
  });

  it("Trả về mã 401 nếu như mà loại giao dịch không hợp lệ ", async () => {
    const req = {
      body: {
        userID: "12345",
        type: "income",
        totalMoney: 1000,
        description: "Salary",
        date: "2025-03-23",
        transactionType: "abc",
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Loại giao dịch không hợp lệ",
    });
  });


describe("edit Transaction", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Trả về mã 404 nếu như transaction không tồn tại", async () => {
    const req = {
      body: {
        userID: "12345",
        type: "income",
        totalMoney: 1000,
        description: "Salary",
        date: "2025-03-23",
        transactionType: "Income",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const transaction = null;
    Transaction.findOne.mockResolvedValue(transaction);
    await editTransaction(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Giao dịch không tồn tại",
    });
  });
  it("Trả về mã 400 nếu như mà số tiền không hợp lệ", async () => {
    const req = {
      body: {
        userID: "123",
        _id: "txn_001",
        type: "income",
        totalMoney: -500, // Số tiền không hợp lệ
        description: "Test",
        date: "2025-03-23",
        transactionType: "Income",
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Transaction.findOne.mockResolvedValue(req.body);

    await editTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Số tiền không hợp lệ" });
  });
  it("Trả về mã 400 nếu như mà loại giao dịch không hợp lệ", async () => {
    const req = {
      body: {
        userID: "123",
        _id: "txn_001",
        type: "income",
        totalMoney: 500,
        description: "Test",
        date: "2025-03-23",
        transactionType: "InvalidType", // Loại giao dịch không hợp lệ
      },
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Transaction.findOne.mockResolvedValue(req.body);

    await editTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Loại giao dịch không hợp lệ",
    });
  });

  it("Trả về mã 200 nếu như mà cập nhật thành công", async () => {
    const req = {
      body: {
        userID: "123",
        _id: "txn_001",
        type: "income",
        totalMoney: 500,
        description: "Updated Transaction",
        date: "2025-03-23",
        transactionType: "Income",
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const existingTransaction = { ...req.body };
    const updatedTransaction = { ...req.body, totalMoney: 600 };
    Transaction.findOne.mockResolvedValue(existingTransaction);
    Transaction.findOneAndUpdate.mockResolvedValue(updatedTransaction);
    await editTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedTransaction);
  });
});

describe("get Transaction", () => {
  it("Trả về mã 200 nếu như mà lấy dữ liệu thành công", async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const transactions = [
      {
        userID: "123",
        type: "income",
        totalMoney: 500,
        description: "Salary",
        date: "2025-03-23",
        transactionType: "Income",
      },
    ];

    Transaction.find.mockResolvedValue(transactions);
    await getTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(transactions);
  });

  it("Trả về mã 500 nếu như mà lấy dữ liệu thất bại", async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const error = new Error("Error");

    Transaction.find.mockRejectedValue(error);
    await getTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});

describe("get Expense Transaction", () => {
  it("Trả về mã 200 và danh sách giao dịch Expense", async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    const transactionsMock = [
      { userID: "123", type: "expense", totalMoney: 200, description: "Rent", date: "2025-03-23", transactionType: "Expense" },
      { userID: "456", type: "expense", totalMoney: 100, description: "Food", date: "2025-03-22", transactionType: "Expense" },
      { userID: "789", type: "income", totalMoney: 300, description: "Shopping", date: "2025-03-21", transactionType: "Income" }, // Không nên có trong kết quả
    ];
  
    // Giả lập Transaction.find() chỉ trả về giao dịch Expense
    Transaction.find.mockResolvedValue(transactionsMock.filter(t => t.transactionType === "Expense"));
  
    await getExpenseTransaction(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    
    // Đảm bảo API chỉ trả về giao dịch "Expense"
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ transactionType: "Expense" }),
    ]));
  
    // Đảm bảo không có giao dịch "Income" trong kết quả
    const returnedData = res.json.mock.calls[0][0]; // Lấy đối số đầu tiên của `json()`
    expect(returnedData.every(t => t.transactionType === "Expense")).toBe(true);
  });

  it("Trả về mã 500 nếu xảy ra lỗi khi truy vấn", async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const error = new Error("Lỗi khi lấy dữ liệu Expense");
    Transaction.find.mockRejectedValue(error);

    await getExpenseTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Lỗi server khi lấy giao dịch Expense" });
  });
});

describe("get Income Transaction", () => {
  it("Trả về mã 200 và danh sách giao dịch Income", async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    const transactionsMock = [
      { userID: "123", type: "expense", totalMoney: 200, description: "Rent", date: "2025-03-23", transactionType: "Expense" },
      { userID: "456", type: "expense", totalMoney: 100, description: "Food", date: "2025-03-22", transactionType: "Expense" },
      { userID: "789", type: "income", totalMoney: 300, description: "Shopping", date: "2025-03-21", transactionType: "Income" }, // Không nên có trong kết quả
    ];
  
    // Giả lập Transaction.find() chỉ trả về giao dịch Income
    Transaction.find.mockResolvedValue(transactionsMock.filter(t => t.transactionType === "Income"));
  
    await getExpenseTransaction(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    
    // Đảm bảo API chỉ trả về giao dịch "Income"
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ transactionType: "Income" }),
    ]));
  
    // Đảm bảo không có giao dịch "Income" trong kết quả
    const returnedData = res.json.mock.calls[0][0]; // Lấy đối số đầu tiên của `json()`
    expect(returnedData.every(t => t.transactionType === "Income")).toBe(true);
  })

  it("Trả về mã 500 nếu xảy ra lỗi khi truy vấn", async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const error = new Error("Lỗi khi lấy dữ liệu Income");
    Transaction.find.mockRejectedValue(error);

    await getIncomeTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Lỗi server khi lấy giao dịch Income" });
  });
})

describe("get Transaction By Month", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} }; 
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  it("Trả về 400 nếu thiếu tháng hoặc năm", async () => {
    await getTransactionByMonth(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Vui lòng cung cấp tháng và năm hợp lệ.",
    });
  });

  it("Trả về 200 và danh sách giao dịch nếu có dữ liệu trong tháng", async () => {
    req.body = { month: 3, year: 2025 };

    const transactionsMock = [
      { userID: "123", type: "income", totalMoney: 500, description: "Salary", date: new Date(2025, 2, 10) }, // March (2 = March)
      { userID: "456", type: "expense", totalMoney: 200, description: "Food", date: new Date(2025, 2, 15) },
    ];

    Transaction.find.mockResolvedValue(transactionsMock);

    await getTransactionByMonth(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(transactionsMock);
  });

  it("Trả về 404 nếu không có giao dịch trong tháng", async () => {
    req.body = { month: 3, year: 2025 };

    Transaction.find.mockResolvedValue([]);

    await getTransactionByMonth(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Không có giao dịch nào trong tháng này." });
  });

  it("Lọc đúng dữ liệu, chỉ trả về giao dịch thuộc tháng được yêu cầu", async () => {
    req.body = { month: 3, year: 2025 };

    const transactionsMock = [
      { userID: "123", type: "income", totalMoney: 500, description: "Salary", date: new Date(2025, 2, 10) }, // March
      { userID: "456", type: "expense", totalMoney: 200, description: "Food", date: new Date(2025, 2, 15) },
      { userID: "789", type: "expense", totalMoney: 300, description: "Shopping", date: new Date(2025, 1, 20) }, // February (Không được tính)
    ];

    Transaction.find.mockResolvedValue(transactionsMock.filter(t => t.date.getMonth() === 2));

    await getTransactionByMonth(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { userID: "123", type: "income", totalMoney: 500, description: "Salary", date: new Date(2025, 2, 10) },
      { userID: "456", type: "expense", totalMoney: 200, description: "Food", date: new Date(2025, 2, 15) },
    ]);
  });

  it("Trả về 500 nếu có lỗi trong quá trình xử lý", async () => {
    req.body = { month: 3, year: 2025 };

    const error = new Error("Lỗi server");
    Transaction.find.mockRejectedValue(error);

    await getTransactionByMonth(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
})

describe("Get User Transactions", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("Trả về mã 400 nếu không có userID", async () => {
    await getTransactionUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Vui lòng cung cấp ID người dùng.",
    });
  });

  it("Trả về mã 404 nếu không có giao dịch nào", async () => {
    req.body.userID = "123";
    Transaction.find.mockResolvedValue([]);

    await getTransactionUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Không có giao dịch nào cho người dùng này.",
    });
  });

  it("Trả về mã 200 và danh sách giao dịch nếu có giao dịch", async () => {
    req.body.userID = "123";
    const transactions = [
      { userID: "123", type: "income", totalMoney: 500, description: "Salary" },
      { userID: "123", type: "expense", totalMoney: 200, description: "Rent" },
    ];

    Transaction.find.mockResolvedValue(transactions);

    await getTransactionUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(transactions);
  });

  it("Trả về mã 500 nếu có lỗi xảy ra", async () => {
    req.body.userID = "123";
    const error = new Error("Database error");
    Transaction.find.mockRejectedValue(error);

    await getTransactionUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});
