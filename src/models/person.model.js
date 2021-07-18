const mongoose = require('mongoose');

// timestamps: https://mongoosejs.com/docs/guide.html#timestamps
// legyen minden dokumentumnak egy createdAt és updatedAt  mezője
const PersonSchema = mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Person', PersonSchema);
