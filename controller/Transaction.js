const Transaction = require("../schema/schema").Transaction;

const createTransactionIncome = async (req, res) => {
  const existTransaction = await Transaction.findOne({
    type: req.body.type,
    totalMoney: req.body.totalMoney,
    description: req.body.description,
    date: req.body.date,
  });
  if (existTransaction) {
    return res.status(400).json({ error: "Transaction already exists" });
  }
  try {
    const { type, totalMoney, description, date, transactionType } = req.body;
    const newTransaction = new Transaction({
      type,
      totalMoney,
      description,
      date,
      transactionType: "Income",
    });
    await newTransaction.save();
    console.log("Transaction mới:", newTransaction);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTransactionExpense = async (req, res) => {
  const existTransaction = await Transaction.findOne({
    type: req.body.type,
    totalMoney: req.body.totalMoney,
    description: req.body.description,
    date: req.body.date,
  });
  if (existTransaction) {
    return res.status(400).json({ error: "Transaction already exists" });
  }
  try {
    const { type, totalMoney, description, date, transactionType } = req.body;
    const newTransaction = new Transaction({
      type,
      totalMoney,
      description,
      date,
      transactionType: Expense,
    });
    await newTransaction.save();
    console.log("Transaction mới:", newTransaction);
    res.status(201).json(cate);
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
        return res.status(400).json({ message: "Vui lòng cung cấp tháng và năm hợp lệ." });
      }
  
      // Chuyển đổi thành ngày bắt đầu và kết thúc của tháng
      const startDate = new Date(year, month - 1, 1); // Ngày đầu tiên của tháng
      const endDate = new Date(year, month, 1); // Ngày đầu tiên của tháng tiếp theo
  
      // Tìm tất cả giao dịch trong khoảng thời gian đó
      const transactions = await Transaction.find({
        date: { $gte: startDate, $lt: endDate }
      });
  
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
  createTransactionIncome,
  createTransactionExpense,
  getTransaction,
  getExpenseTransaction,
  getIncomeTransaction,
  getTransactionByMonth,
};
