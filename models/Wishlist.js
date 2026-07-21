import mongoose from "mongoose";
const wishlistSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Form",
            required:true,
        },
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
        },
    },
    {
        timestamps:true,
    }
);

const Wishlist=mongoose.model("Wishlist",wishlistSchema);
export default Wishlist;