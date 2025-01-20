import mongoose from "mongoose"

// Connect to database
async function connect() {
    try {
        await mongoose.connect(process.env.DB)
        console.log("DB connectedd")
    } catch (err) {
        console.log(err)
    }
    
}

export default connect