//API For Category

const {z} = require('zod');

const Cate = require('../schema/schema').Category;
const Expense = require('../schema/schema').Expense;
const Income = require('../schema/schema').Income;

//Get Category
const GetCate = async (req, res) => {
    try {
        const cate = await Cate.find();
        res.status(200).json(cate);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//Create Category by Admin
const CreateCate = async (req, res) => {
    try{
        const cate = await Cate.create(req.body);
        res.status(201).json(cate);
        console.log("✅ Create Category Success:", cate);
    }
    catch (error) {
        res.status(500).json({message: error.message});
        console.error("❌ Create Category Fail:", error);
    }
   
};

//Update Category by Admin

const UpdateCate = async (req, res) => {
    try {
        const cate = await Cate.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(cate);
        console.log("✅ Update Category Success:", cate);
    }
    catch (error) {
        res.status(500).json({message: error.message});
        console.error("❌ Update Category Fail:", error);
    }
}



//Create Category by User
const CreateCateUser = async (req, res) => {
    const CateSchema = z.object({
        userID: z.string().min(3).max(255),
        Name: z.string().min(3).max(255),
        StarDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "StarDate must be a valid date string",
        }),
        EndDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "EndDate must be a valid date string",
        }),
        Money: z.number().positive(),
        Description: z.string().min(3).max(255),
    });

    try {
        // Kiểm tra dữ liệu đầu vào
        const validatedData = CateSchema.parse(req.body);
        const { userID, Name, StarDate, EndDate, Money, Description } = validatedData;

        // Tạo object Category
        const cate = new Cate({
            userID,
            Name,
            StarDate: new Date(StarDate),
            EndDate: new Date(EndDate),
            Money,
            Description,
        });

        // Lưu vào database
        await cate.save();

        console.log("✅ Create Category Success:", cate);
        res.status(201).json(cate);
    } catch (error) {
        console.error("❌ Create Category Fail:", error);
        
        // Nếu lỗi do validation, trả về mã 400
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }

        res.status(500).json({ message: error.message });
    }
}

//Update Category
const UpdateCateUser = async (req, res) => {
    const CateSchema = z.object({
        Name: z.string().min(3).max(255),
        StarDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "StarDate must be a valid date string",
        }),
        EndDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "EndDate must be a valid date string",
        }),
        Money: z.number().positive(),
        Description: z.string().min(3).max(255),
    });

    try {
        // Kiểm tra dữ liệu đầu vào
        const validatedData = CateSchema.parse(req.body);
        const { Name, StarDate, EndDate, Money, Description } = validatedData;

        // Tìm Category cần update
        const cate = await Cate.findById(req.params.id);
        if (!cate) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Cập nhật thông tin mới
        cate.Name = Name;
        cate.StarDate = new Date(StarDate);
        cate.EndDate = new Date(EndDate);
        cate.Money = Money;
        cate.Description = Description;

        // Lưu vào database
        await cate.save();

        console.log("✅ Update Category Success:", cate);
        res.status(200).json(cate);
    } catch (error) {
        console.error("❌ Update Category Fail:", error);

        // Nếu lỗi do validation, trả về mã 400
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }

        res.status(500).json({ message: error.message });
    }
}

//Delete Category by Id
const DeleteCate = async (req, res) => {
    try {
        const cate = await Cate.findByIdAndDelete(req.params.id);
        res.status(200).json(cate);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}

const DeleteAllCate = async (req, res) => {
    try {
        const cate = await Cate.deleteMany();
        res.status(200).json(cate);
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}




// Lấy danh sách các danh mục của một user
const GetListCateByUser = async (req, res) => {
    try {
      const {userID} = req.params;
      const cate = await Cate.find({User: userID});
      if(!cate) {
        res.status(404).json({message: "Not found any category"});
        console.log("Not found any category");
      }
      res.status(200).json(cate);
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}


//Tạo thu nhập của user trong cate
const CreateIncome = async (req, res) => {
try {
    const IncomeSchema = z.object({
        Date: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Date must be a valid date string",
        }),
        Money: z.number().positive(),
        Description: z.string().min(3).max(255),
        Category: z.string()
    });
    const userID = req.User._id;
    if(!userID){
        return res.status(401).json({message: "Unauthorized"});
    }
    const validate = IncomeSchema.safeParse(req.body);
    if (!validate.success) {
        console.error("❌ Create Income Fail:", validate.error.errors);
        return res.status(400).json({ message: validate.error.errors });
    }
    
    const newIcome = new Income({ ...validate.data});
    await newIcome.save();
    
    console.log("✅ Create Income Success:", newIcome);
    res.status(201).json(newIcome);
}catch (error) {
    res.status(500).json({message: error.message});
    console.error("❌ Create Income Fail:", error);
    }
}


//Tạo chi tiêu của user trong cate
const CreateExpense = async (req, res) => {
    try {
        const ExpenseSchema = z.object({
            Date: z.string().refine((date) => !isNaN(Date.parse(date)), {
                message: "Date must be a valid date string",
            }),
            Amount: z.number().positive(),
            Description: z.string().min(3).max(255),
            Category: z.string()
        });
        const userID = req.User._id;
        if(!userID){
            return res.status(401).json({message: "Unauthorized"});
        }
        const validate = ExpenseSchema.safeParse(req.body);
        if (!validate.success) {
            console.error("❌ Create Income Fail:", validate.error.errors);
            return res.status(400).json({ message: validate.error.errors });
        }
        
        const newExpense = new Expense({ ...validate.data});
        await newExpense.save();
        
        console.log("✅ Create Income Success:", newExpense);
        res.status(201).json(newExpense);
    }catch (error) {
        res.status(500).json({message: error.message});
        console.error("❌ Create Income Fail:", error);
        }
}



module.exports = {
   GetCate,
    CreateCate,
    UpdateCate,
    DeleteCate,
    DeleteAllCate,
    GetListCateByUser,
    CreateCateUser,
    UpdateCateUser,
    CreateIncome,
    CreateExpense
}