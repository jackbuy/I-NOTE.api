import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ //tag
    title: { type: String },
    name: { type: String }
});
