import mongoose from 'mongoose';

const watchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video', // Reference to the Video model
    required: true,
  },
  watchedAt: {
    type: Date,
    default: Date.now,
  },
});

export const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);
