const { GoogleGenerativeAI } = require("@google/generative-ai");    
const GeneratedContent  = require('../schema/schema').GeneratedContent;


const AI = new GoogleGenerativeAI(process.env.AI_KEY);

const generateContent = async (req, res) => {
    try {
        const { userPrompt } = req.body;

        if (!userPrompt) {
            return res.status(400).json({ error: "Prompt không được để trống." });
        }

        const finalPrompt = `Chuyển đổi đoạn văn bản sau thành định dạng JSON của hóa đơn thanh toán.
         : "${userPrompt}" Đảm bảo JSON chỉ bao gồm các trường:  'items' (mỗi item có 'productName', 'quantity', 'price'), 'totalAmount', "Date.
        Đảm bảo định dạng hợp lệ. nếu không hợp lệ thì sẽ tạo mã JSON "note" thông báo rằng cái gì không hợp lệ theo mã json.
        Đảm bảo có phân loại "category" thể loại giao dịch ví dụ như ( đồ ăn , vui chơi , mua sắm, sinh hoạt ,...) `;
        console.log("Prompt cuối cùng:", finalPrompt);
        const model = AI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(finalPrompt);

        // In ra kết quả trả về từ AI để kiểm tra
        console.log("Dữ liệu trả về từ AI:", result.response.text());

        let resultText = result.response.text();

        // Làm sạch dữ liệu trả về: Loại bỏ phần markdown và backticks
        resultText = resultText.replace(/```json|\n|```/g, '').trim(); // Xóa backticks và markdown

        // Log kết quả sau khi làm sạch
        console.log("Dữ liệu sau khi làm sạch:", resultText); 

        // Kiểm tra lại xem dữ liệu đã thành JSON hợp lệ chưa
        if (!resultText.startsWith('{') || !resultText.endsWith('}')) {
            return res.status(500).json({ error: "Dữ liệu trả về không phải JSON hợp lệ." });
        }

        // Phân tích JSON sau khi đã làm sạch
        let resultJson;
        try {
            resultJson = JSON.parse(resultText);
        } catch (error) {
            return res.status(500).json({ error: `Lỗi khi phân tích JSON: ${error.message}` });
        }

        // Lưu kết quả vào database (MongoDB)
        const newGeneratedContent = new GeneratedContent({
            prompt: userPrompt,
            result: JSON.stringify(resultJson), // Chuyển đổi kết quả thành chuỗi JSON trước khi lưu
        });

        await newGeneratedContent.save(); // Lưu vào cơ sở dữ liệu

        res.status(200).json({ result: resultJson });
    } catch (error) {
        console.error("Lỗi trong quá trình xử lý:", error); // Log lỗi nếu có
        res.status(500).json({ error: `Lỗi khi xử lý AI: ${error.message}` });
    }
}

module.exports = {
    generateContent
}