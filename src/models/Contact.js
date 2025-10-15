const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: String,
    // kullanıcıya ait olduğunu gösteren alan (zorunlu)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
