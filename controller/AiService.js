const { GoogleGenerativeAI } = require("@google/generative-ai");    
const GeneratedContent  = require('../schema/schema').GeneratedContent;
const Transaction = require('../schema/schema').Transaction;


const AI = new GoogleGenerativeAI(process.env.AI_KEY);

const generateContent = async (req, res) => {
    try {
        const { userPrompt } = req.body;

        if (!userPrompt) {
            return res.status(400).json({ error: "Prompt không được để trống." });
        }

        const finalPrompt = `Chuyển đổi đoạn văn bản sau thành JSON giúp tôi:"${userPrompt}".Đảm bảo rằng đoạn văn bản trả về cho 
        tôi đúng cấu trúc sau:'transaction ' (Trong mỗi transaction  có các trường như type:(type là loại hoán đơn ví dụ như:"Mua Sắm","Ăn Uống","Bệnh viện","Tiền lương"...),totalMoney:(totalMoney là tổng số tiền trên hóa đơn,),
        description:(description là mô tả về hóa đơn ví dụ như:"Mua sắm tại siêu thị Coopmart","Đi ăn tại nhà hàng ABC","Đi khám bệnh tại bệnh viện X","Nhận lương tháng 10"...),
        date:(date là ngày tháng năm trên hóa đơn lấy theo giờ UTC ví dụ như:"2024-12-31T17:00:00.000+00:00"...), transactionType:(transactionType là loại giao dịch ví dụ như:"Income","Expense")) `;
        console.log("Prompt cuối cùng:", finalPrompt);
        const model = AI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(finalPrompt);

        // In ra kết quả trả về từ AI để kiểm tra
        console.log("Dữ liệu trả về từ AI:", result.response.text());

        let resultText = result.response.text();

        // Làm sạch dữ liệu trả về: Loại bỏ phần markdown và backticks
        resultText = resultText.replace(/```json|\n|```/g, '').trim(); // Xóa backticks và markdown

        // Log kết quả sau khi làm sạch

        // Kiểm tra lại xem dữ liệu đã thành JSON hợp lệ chưa
        if (!resultText.startsWith('{') || !resultText.endsWith('}')) {
            return res.status(500).json({ error: "Dữ liệu trả về không phải JSON hợp lệ." });
        }

        console.log("Dữ liệu sau khi làm sạch:", resultText);

        // Phân tích JSON sau khi đã làm sạch
        let resultJson;
        try {
            resultJson = JSON.parse(resultText);
        } catch (error) {
            return res.status(500).json({ error: `Lỗi khi phân tích JSON: ${error.message}` });
        }
        const transaction = resultJson.transaction;

        const { type, totalMoney, description, date, transactionType } = transaction;

        const newTransaction = new Transaction({
            type,
            totalMoney,
            description,
            date,
            transactionType
        });

        console.log("Transaction mới:", newTransaction);
        
        // const newTransaction = await Transaction.create(transaction);
        // console.log("Transaction mới:", newTransaction);

        res.status(200).json({ result: newTransaction });
    } catch (error) {
        console.error("Lỗi trong quá trình xử lý:", error); // Log lỗi nếu có
        res.status(500).json({ error: `Lỗi khi xử lý AI: ${error.message}` });
    }
}



module.exports = {
    generateContent
}