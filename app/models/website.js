const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const WebsiteSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      lowercase: true,
      unique: true
    },
    ownerId: {
      type: Number,
      required: true
    },
    leadCount: {
      type: Number,
      required: true
    },
    plan: {
      type: String,
      required: true
    },
    labels: [String]
  },
  {
    versionKey: false,
    timestamps: false
  }
)
WebsiteSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Website', WebsiteSchema)
