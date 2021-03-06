const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blog, User, Comment} = require('../models');

// Get request to get the homepage with any blogs that are already up
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

        const blogs = blogData.map((blog) => blog.get({plain: true}));

// Render the homePage.handlebar to html
        res.render('homepage', {
            blogs,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
// Get route to get specific blogs by ID and render a single page
router.get('/blog/:id', async (req,res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            atrributes: [
                'id',
                'title',
                'description',
                'date_created',
            ],
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

        const blog = blogData.map((blog) => blog.get({plain: true}));
        res.render('oneBlog', {
            ...blog,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// router.get('/dashboard', withAuth, async (req, res) => {
//     try {
//         const userData = await User.findByPk(req.session.user_id, {
//             atrributes: { exclude: ['password'] },
//             include: { 
//                 model: Blog,
//                 atrributes: [
//                     'id',
//                     'title',
//                     'description',
//                     'date_created',
//                 ],
//             },
//         });

//         const user = userData.get({ plain: true });

//         res.render('dashboard', {
//             ...user,
//             logged_in: true
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

module.exports = router;