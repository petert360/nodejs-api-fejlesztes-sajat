const mongoose = require('mongoose');

// timestamps: https://mongoosejs.com/docs/guide.html#timestamps
// legyen minden dokumentumnak egy createdAt és updatedAt  mezője
const PersonSchema = mongoose.Schema(
    { firstName: String, lastName: String, email: String },
    { timestamps: true }
);

module.exports = mongoose.model('Person', PersonSchema);
