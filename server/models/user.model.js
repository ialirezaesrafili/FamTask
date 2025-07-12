import { model, Schema } from "mongoose";

const friendsListModel = new Schema({

})

const userModel = new Schema({
    username: {
        type: String,
        required: true,
        
    }




}, {
    timestamps: true
})
