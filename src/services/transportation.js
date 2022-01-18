const  Transportation  = require('../models/transportation.models');

const queryTransportation = async (filter, options) => {
    const transportation = await Transportation.paginate(filter, options);
    return transportation;
};

module.exports = {
    queryTransportation,
};
