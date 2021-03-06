const mongoose = require('mongoose');

const repoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    usage: {
      type: Number,
      required: true
    },
    labels: {
      type: Object,
      // required: true
    },
    owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pendingOwners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true
  }
);

const Repo = mongoose.model('Repo', repoSchema);

module.exports = Repo;
