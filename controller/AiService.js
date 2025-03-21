const { GoogleGenerativeAI } = require("@google/generative-ai");
const GeneratedContent = require("../schema/schema").GeneratedContent;
const Transaction = require("../schema/schema").Transaction;

const AI = new GoogleGenerativeAI(process.env.AI_KEY);

const generateContent = async (req, res) => {
  try {
    const { userPrompt } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ error: "Prompt không được để trống." });
    }

    const cleanUserPrompt = userPrompt.replace(/\n+/g, " ").trim();
    console.log("userPrompt sau khi làm sạch:", cleanUserPrompt);

    // 🔹 Chuẩn bị Prompt cho AI
    const finalPrompt = `Chuyển đổi đoạn văn bản sau thành JSON giúp tôi:"${cleanUserPrompt}".Đảm bảo rằng đoạn văn bản trả về cho 
        tôi đúng cấu trúc sau:'transaction ' (Trong mỗi transaction  có các trường như type:(type là loại hoán đơn ví dụ như
        :"Mua Sắm","Ăn Uống","Bệnh viện","Tiền lương"...),totalMoney:(totalMoney là tổng số tiền trên hóa đơn ) nếu tổng tiền không phải tiền việt chuyển đổi sang tiền việt,
        description:(description là mô tả về hóa đơn sử dụng ở đâu ví dụ như:"Mua sắm tại siêu thị Coopmart","Đi ăn tại nhà hàng ABC","
        Đi khám bệnh tại bệnh viện X","Nhận lương tháng 10"...),
        date:(date là ngày tháng năm trên hóa đơn lấy theo giờ UTC ví dụ như:"2024-12-31T17:00:00.000+00:00"...) nếu không có date thì date là ngày hiện tại,
        transactionType:(transactionType là loại giao dịch  nếu là "hóa đơn Thu nhập" thì là "Income"
         hoặc "hóa đơn Thanh toán" thì là "Expense"  )) chỉ trả về các giá trị mà tôi yêu cầu không trả lời gì thêm`;

    // 🔹 Gọi AI Model
    const model = AI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(finalPrompt);

    // 🔹 Kiểm tra dữ liệu AI trả về
    console.log("Dữ liệu trả về từ AI:", JSON.stringify(result, null, 2));
    let resultText = result.response.text();

    // 🔹 Làm sạch dữ liệu JSON
    resultText = resultText.replace(/```json|```/g, "").trim();
    console.log("Dữ liệu sau khi làm sạch:", resultText);

    let resultJson;
    try {
      resultJson = JSON.parse(resultText);
    } catch (error) {
      console.error("Lỗi khi phân tích JSON:", error.message);
      return res
        .status(500)
        .json({ error: `Lỗi phân tích JSON: ${error.message}` });
    }

    // 🔹 Kiểm tra JSON hợp lệ
    if (!resultJson.transaction) {
      return res
        .status(500)
        .json({ error: "Dữ liệu không chứa transaction hợp lệ." });
    }
    const { type, totalMoney, description, date, transactionType } =
      resultJson.transaction;

    // 🔹 Kiểm tra lại kiểu dữ liệu trước khi lưu
    if (typeof totalMoney !== "number" || isNaN(Date.parse(date))) {
      return res
        .status(400)
        .json({ error: "Dữ liệu transaction không hợp lệ." });
    }

    const newTransaction = new Transaction({
      userID:req.body.userID,
      type,
      totalMoney,
      description,
      date, // Chuyển đổi đúng định dạng
      transactionType,
    });

    const existingTransaction = await Transaction.findOne({
      type,
      totalMoney,
      description,
      date,
      transactionType,
    });

    if (existingTransaction) {
      return res.status(400).json({ error: "Transaction đã tồn tại" });
    }

    console.log("Transaction mới:", newTransaction);

    // 🔹 Lưu vào MongoDB
    try {
      await newTransaction.save();
      console.log("Lưu giao dịch thành công:", newTransaction);
    } catch (dbError) {
      console.error("Lỗi khi lưu MongoDB:", dbError);
      return res.status(500).json({ error: `Lỗi MongoDB: ${dbError.message}` });
    }

    res.status(200).json({ result: newTransaction });
  } catch (error) {
    console.error("Lỗi trong quá trình xử lý:", error);
    res.status(500).json({ error: `Lỗi khi xử lý AI: ${error.message}` });
  }
};

module.exports = {
  generateContent,
};
