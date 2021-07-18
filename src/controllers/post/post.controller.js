const createError = require('http-errors');

const logger = require('../../config/logger');
const postService = require('./post.service');

exports.create = (req, res, next) => {
    // ellenőrzés, hogy az adatok megfelelőek-e
    const { title, body, author } = req.body;
    if (!title || !body || !author) {
        return next(
            new createError.BadRequest(
                'Request body must contain title, body, author parameters'
            )
        );
    }

    const postData = {
        title,
        body,
        author,
    };

    return (
        postService
            .create(postData)
            .then(createdPost => {
                res.status(201);
                res.json(createdPost);
            })
            // éles helyzetben nem szabad err.meessage-t visszaküldeni, sebezhetőséget jelent
            .catch(err => next(new createError.BadRequest(err.message)))
    );
};

exports.findOne = (req, res, next) => {
    return postService
        .findOne(req.params.id)
        .then(post => {
            if (!post) {
                return next(new createError.BadRequest('Post is not found'));
            }
            res.json(post);
        })
        .catch(err => {
            return next(new createError.InternalServerError(err.message));
        });
};
