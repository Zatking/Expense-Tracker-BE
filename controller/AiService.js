const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GeneratedContent, Transaction } = require("../schema/schema");

const AI = new GoogleGenerativeAI(process.env.AI_KEY);

const generateContent = async (req, res) => {
  try {
    const { userPrompt, userID } = req.body;

    if (!userPrompt) return res.status(400).json({ error: "Prompt không được để trống." });
    if (!userID) return res.status(400).json({ error: "UserID không hợp lệ." });

    const cleanUserPrompt = userPrompt.replace(/\n+/g, " ").trim();
    console.log("userPrompt sau khi làm sạch:", cleanUserPrompt);

    // 🔹 Prompt yêu cầu AI xử lý
    const finalPrompt = `Chuyển đổi đoạn văn bản sau thành JSON giúp tôi: "${cleanUserPrompt}". 
      Đảm bảo rằng JSON có cấu trúc 'transaction' với các trường sau:
      - type: Loại hóa đơn (ví dụ: "Mua Sắm", "Ăn Uống", "Bệnh viện", "Tiền lương").
      - totalMoney: Tổng số tiền trên hóa đơn. Nếu không phải tiền Việt Nam (VND), hãy chuyển đổi sang VND.
      - description: Mô tả hóa đơn (ví dụ: "Mua sắm tại siêu thị Coopmart").
      - date: Ngày tháng năm theo UTC format "YYYY-MM-DDTHH:mm:ss.sssZ". Nếu không có, hãy dùng ngày hiện tại.
      - transactionType: "Income" (thu nhập) hoặc "Expense" (chi tiêu).
      Chỉ trả về JSON, không trả lời gì thêm.`;

    // 🔹 Gọi AI Model
    const model = AI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let result;
    try {
      result = await model.generateContent(finalPrompt);
    } catch (error) {
      console.error("Lỗi khi gọi AI:", error);
      return res.status(500).json({ error: "Lỗi khi kết nối với AI" });
    }

    let resultText = result?.response?.text()?.replace(/```json|```/g, "").trim();
    if (!resultText) {
      return res.status(500).json({ error: "AI không trả về dữ liệu hợp lệ." });
    }

    console.log("Dữ liệu từ AI:", resultText);

    // 🔹 Kiểm tra JSON hợp lệ
    let transactionData;
    try {
      transactionData = JSON.parse(resultText)?.transaction;
      if (!transactionData) throw new Error("Dữ liệu không chứa transaction hợp lệ.");
    } catch (error) {
      return res.status(500).json({ error: `Lỗi phân tích JSON: ${error.message}` });
    }

    const { type, totalMoney, description, date, transactionType } = transactionData;

    // 🔹 Kiểm tra dữ liệu đầu vào
    if (!type || !description || !transactionType) {
      return res.status(400).json({ error: "Thiếu thông tin giao dịch." });
    }
    if (typeof totalMoney !== "number" || totalMoney <= 0) {
      return res.status(400).json({ error: "Tổng số tiền không hợp lệ." });
    }
    if (!Date.parse(date)) {
      return res.status(400).json({ error: "Ngày giao dịch không hợp lệ." });
    }

    // 🔹 Kiểm tra transaction đã tồn tại
    try {
      const existingTransaction = await Transaction.findOne({
        userID,
        type,
        totalMoney,
        description,
        date,
        transactionType,
      });

      if (existingTransaction) {
        return res.status(400).json({ error: "Transaction đã tồn tại." });
      }
    } catch (error) {
      console.error("Lỗi kiểm tra transaction:", error);
      return res.status(500).json({ error: "Lỗi khi kiểm tra transaction" });
    }

    // 🔹 Lưu vào MongoDB
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

    res.status(200).json({ result: newTransaction });
  } catch (error) {
    console.error("Lỗi trong quá trình xử lý:", error);
    res.status(500).json({ error: `Lỗi khi xử lý AI: ${error.message}` });
  }
};

module.exports = { generateContent };
