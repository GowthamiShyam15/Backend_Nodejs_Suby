const express = require("express")
const dotEnv = require("dotenv")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const vendorRoutes = require("./routes/vendorRoutes")
const firmRoutes = require("./routes/firmRoutes")
const productRoutes = require("./routes/productRoutes")
const cors = require('cors')

const path = require("path")


const app = express()
app.use(cors())
const PORT = process.env.PORT || 4000

dotEnv.config()

app.use(bodyParser.json())

app.use("/vendor",vendorRoutes)
app.use("/firm", firmRoutes)
app.use("/product", productRoutes);
app.use("/uploads", express.static("uploads"))

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected Successfully.")
})
.catch((error)=>{
    console.log(error)
})
app.listen(PORT,()=>{
    console.log(`Server Started and Running at ${PORT}`)
});

app.use("/",(req,res)=>{
    res.send("<h1>Welcome to SUBY</h1>")
})