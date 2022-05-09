const router = require('express').Router();
const {User,Blog, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

// Get all blog posts
router.get('/', async (req, res)=> {
    try {
        const blogData = await Blog.findAll({
            atrributes: [
                'id',
                'title',
                'description',
                'date_created',
            ],
            order: [['date_created', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment',
                        'blog_id',
                        'user_id',
                    ],
                    include: {
                        model: User,
                        atrributes: ['name']
                    }
                },
            ],
        });

        const blogs = blogData.map((project) => project.get({plain: true}));
// Render the homePage.handlebar to html
        res.json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});
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
        });

        if (!projectData) {
            res.status(404).json({ message: 'No blog found with this id!' });
            return;
        }

        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;