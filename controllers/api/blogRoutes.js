const router = require('express').Router();
const {User, Blog, Comment} = require('../../models');
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
                        'created_at',
                    ],
                    include: {
                        model: User,
                        atrributes: ['name']
                    }
                },
            ],
        });

        const blogs = blogData.map((project) => project.get({plain: true}));
        res.json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get blog post by ID
router.get('/:id', async (req, res)=> {
    try {
        const blogData = await Blog.findOne({
            where: {
                id: req.params.id
            },
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
                        'created_at'
                    ],
                    include: {
                        model: User,
                        atrributes: ['name']
                    }
                },
            ],
        });

        const blogs = blogData.map((blog) => blog.get({plain: true}));
        if (!blogs) {
            res.status(404).json({ message: 'No blog post with this id!'});
            return;
        } res.json(blogs);
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


// Update blog post 
router.put('/:id', withAuth, (req, res) => {
    try {
        const updateBlog = await Blog.update({
            where: {
                id: req.params.id
            }
        });
        if (!updateBlog) {
            res.status(404).json({ message: 'No blog post with that ID found!'});
            return;
        } res.json(updateBlog);
    } catch (err) {
        res.status(500).json(err);
    }
})
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