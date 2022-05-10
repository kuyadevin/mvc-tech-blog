const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blog, User, Comment} = require('../models');
const withAuth = require('../../utils/auth');

// Get route to render the dashboard
router.get('/', withAuth, async (req, res)=> {
    try {
        const blogData = await Blog.findAll({
            where: {
                user_id: req.session.user_id
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

// Render the dashboard.handlebar to html
        res.render('dashboard', {
            blogs,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});