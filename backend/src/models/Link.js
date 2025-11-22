const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Za-z0-9]{6,8}$/,
    maxlength: 8
  },
  targetUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid URL format'
    }
  },
  clicks: {
    type: Number,
    default: 0
  },
  lastClicked: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

linkSchema.index({ code: 1 });
linkSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Link', linkSchema);