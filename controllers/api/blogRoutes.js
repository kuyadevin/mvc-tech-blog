const router = require('express').Router();
const {Blog} = require('../../models');
const withAuth = require('../../utils/auth');

//Create a new blog post but must be logged in
router.post('/', withAuth, async (req, res)=> {
    try {
        const newBlog = await Blog.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.status(200).json(newBlog);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Deleted a blog post by ID but it must be done by user that created it
router.delete('/:id', withAuth, async (req, res)=> {
    try {
        const blogData = await Blog.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        })
    }
})