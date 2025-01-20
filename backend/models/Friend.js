import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
  name: { type: String, required: true },
  preferences: {
    mood: { type: Object, default: {} }, 
    genre: { type: Object, default: {} },
    timeReleased: { type: Object, default: {} },
    length: { type: Object, default: {} }
  }
});

const Friend = mongoose.model('Friend', friendSchema);

export default Friend;
