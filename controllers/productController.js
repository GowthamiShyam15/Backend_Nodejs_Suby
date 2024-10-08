const Firm = require("../models/Firm");
const Product = require("../models/Product")
const multer = require("multer")
const path = require("path");

// Set up storage using multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Set destination folder for uploads
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      // Set filename to be original filename
      cb(null, Date.now()+ path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
    try {
      const { productName, price, category, bestSeller, description } =
        req.body;

      const image = req.file ? req.file.filename : undefined;

      const firmId = req.params.firmId;
      const firm = await Firm.findById(firmId);

      if (!firm) {
        res.status(404).json({ message: "No Firm found" });
      }
      const product = new Product({
        productName,
        price,
        category,
        bestSeller,
        description,
        image,
        firm: firm._id,
      });
      const savedProduct = await product.save()
      firm.products.push(savedProduct);
      await firm.save();

      return res.status(200).json(savedProduct);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal Server error" });
    }
}

const getProductByFirm = async(req, res)=>{
    try {
        const firmId = req.params.firmId
        const firm = await Firm.findById(firmId)

        if(!firm){
            res.status(404).json({ message: "No Firm found" });
        }
        //to get firm name
        const restaurantName = firm.firmName

        const products = await Product.find({firm: firmId})

        res.status(200).json({ restaurantName, products });
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: "internal Server error" });
    }
}

//deletion

const deleteProductById = async(req, res)=>{
    try {
        const productId = req.params.productId
        const deletedProduct = await Product.findByIdAndDelete(productId)
        if(!deletedProduct){
            return res.status(404).json({error:"No Produt Found"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal Server error" });
        
    }
}
module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductByFirm,
  deleteProductById,
};