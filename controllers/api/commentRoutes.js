const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all comments
router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll();
        res.json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create a new comment
router.post('/', withAuth, async (req, res)=> {
    if (req.session) {
        try {
            const newComment = await Comment.create({
              comment: req.body.comment,
              blog_id: req.body_id,
              user_id: req.body.user_id,
            })
            res.json(newComment);
        } catch (err) {
            res.status(500).json(err);
        }
    }
});

// Delete a comment 
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const deleteComment = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });
        if (!deleteComment) {
            res.status(404).json({ message: 'No comment found with this ID!'});
            return;
        }
        res.status(200).json(deleteComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;



