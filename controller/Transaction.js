const Transaction = require("../schema/schema").Transaction;

const createTransaction = async (req, res) => {
  const existTransaction = await Transaction.findOne({
    userId: req.body.userId,
    type: req.body.type,
    totalMoney: req.body.totalMoney,
    description: req.body.description,
    date: req.body.date,
  });
  if (existTransaction) {
    return res.status(400).json({ error: "Transaction already exists" });
  }
  try {
    const { userId, type, totalMoney, description, date, transactionType } =
      req.body;
    const newTransaction = new Transaction({
      userId,
      type,
      totalMoney,
      description,
      date,
      transactionType,
    });
    await newTransaction.save();
    console.log("Transaction mới:", newTransaction);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.body.userID);
    if (!transaction) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }
    transaction.userId = req.body.userId;
    transaction.type = req.body.type;
    transaction.totalMoney = req.body.totalMoney;
    transaction.description = req.body.description;
    transaction.date = req.body.date;
    transaction.transactionType = req.body.transactionType;
    await transaction.save();
    res.status(200).json(transaction);
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
    const transaction = await Transaction.find({ transactionType: "Expense" });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIncomeTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.find({ transactionType: "Income" });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactionUser = async (req, res) => {
  try {
    const transaction = await Transaction.find({ userID: req.body.userId });
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
};
