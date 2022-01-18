const mongoose = require('mongoose');
const paginate = require('./plugin/paginate.plugin');
const toJson = require('./plugin/toJson.plugin');

const { ObjectId } = mongoose.Schema;

const transportationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    owner: {
        type: ObjectId,
        ref: 'Owner',
    },
    type: {
        type: String,
    },
    image: [
        { type: String },
    ],
}, {
    timestamps: true,
});

transportationSchema.plugin(toJson);
transportationSchema.plugin(paginate);

/**
 * @typedef Transportation
 */
const Transportation = mongoose.model('Transportation', transportationSchema);

module.exports = Transportation;
