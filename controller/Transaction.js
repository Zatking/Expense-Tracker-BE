const Transaction = require("../schema/schema").Transaction;

const createTransaction = async (req, res) => {
  try {
    const { userID, type, totalMoney, description, date, transactionType } =
      req.body;

    // 🔹 Kiểm tra dữ liệu đầu vào
    if (!userID || !type || !totalMoney || !description || !date || !transactionType) {
      return res.status(400).json({
        error: "Transaction thiếu thông tin. Vui lòng cung cấp đủ thông tin!",
      });
    }

    // 🔹 Kiểm tra nếu số tiền âm
    if (totalMoney < 0) {
      return res.status(401).json({ message: "Số tiền không hợp lệ" });
    }

    // 🔹 Kiểm tra loại giao dịch hợp lệ
    if (transactionType !== "Income" && transactionType !== "Expense") {
      return res.status(401).json({ message: "Loại giao dịch không hợp lệ" });
    }

    // 🔹 Kiểm tra nếu giao dịch đã tồn tại
    const existTransaction = await Transaction.findOne({
      userID,
      type,
      totalMoney,
      description,
      date,
      transactionType,
    });

    if (existTransaction) {
      return res.status(400).json({ error: "Transaction đã tồn tại" });
    }

    // 🔹 Lưu giao dịch mới
    const newTransaction = new Transaction({
      userID,
      type,
      totalMoney,
      description,
      date,
      transactionType,
    });

    await newTransaction.save();
    console.log("Lưu giao dịch thành công:", newTransaction);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("🔥 Lỗi trong createTransaction:", error);
    res.status(500).json({ message: error.message });
  }
};

const getExpenseTransactionNow = async(req,res) =>{
  try {
    const { userID } = req.body;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const expenseTransaction = await Transaction.find({ userID, type: "Expense", date: { $gte: startOfDay, $lt: endOfDay } });
    if (expenseTransaction.length === 0) {
      return res.status(404).json({ message: "Không có giao dịch nào trong ngày hôm nay." });
    }
    res.status(200).json(expenseTransaction);
    
  }catch (error) {
    console.error("Lỗi khi lấy danh sách Expense:", error);
    return res.status(500).json({ message: "Lỗi server khi lấy giao dịch Expense" });
  }
}

const totalMoney= async(req,res) =>{
  try{
    const {userID}=req.body;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    // Tính tổng tiền sử dụng trong tháng nếu như là income thì cộng expense thì trử
    const expenseMoney = await Transaction.aggregate([
      { $match: { userID, type: "Expense", date: { $gte: startOfDay, $lt: endOfDay } } },
      { $group: { _id: null, totalMoney: { $sum: "$totalMoney" } } }
    ]);
    const incomeMoney = await Transaction.aggregate([
      { $match: { userID, type: "Income", date: { $gte: startOfDay, $lt: endOfDay } } },
      { $group: { _id: null, totalMoney: { $sum: "$totalMoney" } } }
    ]);
    const totalMoney = incomeMoney[0]?.totalMoney - expenseMoney[0]?.totalMoney || 0;
    res.status(200).json({ totalMoney });
  }
  catch (error) {
    console.error("Lỗi khi tính tổng tiền:", error);
    return res.status(500).json({ message: "Lỗi server khi tính tổng tiền" });
  }
}

const getIncomeTransactionNow = async(req,res) =>{
  try {
    const { userID } = req.body;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const expenseTransaction = await Transaction.find({ userID, type: "Income", date: { $gte: startOfDay, $lt: endOfDay } });
    if (expenseTransaction.length === 0) {
      return res.status(404).json({ message: "Không có giao dịch nào trong ngày hôm nay." });
    }
    res.status(200).json(expenseTransaction);
    
  }catch (error) {
    console.error("Lỗi khi lấy danh sách Expense:", error);
    return res.status(500).json({ message: "Lỗi server khi lấy giao dịch Expense" });
  }
}

const totalMoneyIncome = async(req,res) =>{
  try{
    const {userID}=req.body;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    // Tính tổng tiền Income
    const incomeMoney = await Transaction.aggregate([
      { $match: { userID, type: "Income", date: { $gte: startOfDay, $lt: endOfDay } } },
      { $group: { _id: null, totalMoney: { $sum: "$totalMoney" } } }
    ]);
    const totalMoney = incomeMoney[0]?.totalMoney || 0;
    res.status(200).json({ totalMoney });
  }catch (error) {
    console.error("Lỗi khi tính tổng tiền:", error);}}

const totalMoneyExpense = async(req,res) =>{
  try{
    const {userID}=req.body;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    // Tính tổng tiền Expense
    const expenseMoney = await Transaction.aggregate([
      { $match: { userID, type: "Expense", date: { $gte: startOfDay, $lt: endOfDay } } },
      { $group: { _id: null, totalMoney: { $sum: "$totalMoney" } } }
    ]);
    const totalMoney = expenseMoney[0]?.totalMoney || 0;
    res.status(200).json({ totalMoney });
  }catch (error) {
    console.error("Lỗi khi tính tổng tiền:", error);
    return res.status(500).json({ message: "Lỗi server khi tính tổng tiền" });
  }
}

const editTransaction = async (req, res) => {
  try {
    const { userID, _id, type, totalMoney, description, date, transactionType } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (totalMoney < 0) {
      return res.status(400).json({ message: "Số tiền không hợp lệ" });
    }
    if (!["Income", "Expense"].includes(transactionType)) {
      return res.status(400).json({ message: "Loại giao dịch không hợp lệ" });
    }

    // Kiểm tra giao dịch có tồn tại không
    const transaction = await Transaction.findOne({ userID, _id });
    if (!transaction) {
      return res.status(404).json({ message: "Giao dịch không tồn tại" });
    }

    // Cập nhật giao dịch và lấy dữ liệu mới nhất
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { userID, _id },
      { type, totalMoney, description, date, transactionType },
      { new: true } // Trả về dữ liệu sau khi cập nhật
    );

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.find();
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExpenseTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find({ transactionType: "Expense" });
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách Expense:", error);
    return res.status(500).json({ message: "Lỗi server khi lấy giao dịch Expense" });
  }
};

const getIncomeTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find({ transactionType: "Income" });
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách Income:", error);
    return res.status(500).json({ message: "Lỗi server khi lấy giao dịch Income" });
  }
};

const getTransactionByMonth = async (req, res) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp tháng và năm hợp lệ." });
    }

    // Chuyển đổi thành ngày bắt đầu và kết thúc của tháng
    const startDate = new Date(year, month - 1, 1); // Ngày đầu tiên của tháng
    const endDate = new Date(year, month, 1); // Ngày đầu tiên của tháng tiếp theo

    // Tìm tất cả giao dịch trong khoảng thời gian đó
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lt: endDate },
    });

    if(transactions.length === 0) {
      return res.status(404).json({ message: "Không có giao dịch nào trong tháng này." });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactionUser = async (req, res) => {
  const userID = req.body.userID;
  if(!userID) {
    return res.status(400).json({ message: "Vui lòng cung cấp ID người dùng." });
  }
  try {
    const transaction = await Transaction.find({ userID: userID });
    if(transaction.length === 0) {
      return res.status(404).json({ message: "Không có giao dịch nào cho người dùng này." });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTransaction,
  editTransaction,
  getTransactionUser,
  getTransaction,
  getExpenseTransaction,
  getIncomeTransaction,
  getTransactionByMonth,
  getExpenseTransactionNow,
  getIncomeTransactionNow,
  totalMoney,
  totalMoneyIncome,
  totalMoneyExpense,
};
