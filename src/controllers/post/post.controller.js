const createError = require('http-errors');

const logger = require('../../config/logger');
const postService = require('./post.service');

exports.create = (req, res, next) => {
    // ellenőrzés, hogy az adatok megfelelőek-e
    const { title, body, author_id } = req.body;
    if (!title || !body || !author_id) {
        return next(
            new createError.BadRequest(
                'Request body must contain title, body, author_id parameters'
            )
        );
    }

    const postData = {
        title,
        body,
        authorId: author_id,
    };

    return postService
        .create(postData)
        .then(createdPost => {
            res.status(201);
            res.json(createdPost);
        })
        // éles helyzetben nem szabad err.meessage-t visszaküldeni, sebezhetőséget jelent
        .catch(err => next(new createError.BadRequest(err.message)));
};
