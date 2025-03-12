import mongoose from "mongoose";

export async function main() {
    await mongoose.connect(process.env.DB_URI)
    console.log('Connected in db')
}

main().catch(e => console.log(e))