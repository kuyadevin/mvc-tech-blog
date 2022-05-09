const router = require('express').Router();
//Importaing User Model
const { User, Blog, Comment } = require('../../models');
const session = require('express-session');
const withAuth = require('../../utils/auth');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Get route to get all of the users
router.get('/', async (req, res) => {
    try {
        const allUsers = await User.findAll({
            attributes: {
                exclude: [
                    'password'
                ],
            },
        });
        
        const userData = allUsers.map((user) => user.get({ plain:true}));
        res.json(userData);
    }catch (err) {
        res.status(500).json(err);
    }
});

// Get user by a specific id
router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            atrributes: { exclude: ['password'] },
            include: [
                {
                    model: Blog,
                    atrributes: [
                        'id',
                        'title',
                        'description',
                        'date_created',
                    ],
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
                        model: Blog,
                        atrributes: ['title']
                    }
                },
            ],
        });

        const user = blogData.map((user) => userData.get({ plain: true }));
        if (!user) {
            res.status(404).json({ message: 'There are no users with this ID!'});
            return;
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Post route to create a new logged in user
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(()=> {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Post route to log in
router.post('login', async (req, res) => {
    try {
        const userData = await User.findOne({where : {email: req.body.email}
        });

// Looking for a user where the email matches the email being put in 
        if (!userData) {
            res.status(400).json({ message: 'Incorrect email or password, please try again!'});
            return;
        }
// Creating a variable for a valid/correct password
        const validPassword = userData.checkPassword(req.body.password);
// Checking to see if the password put in matches the one saved to a user
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password, please try again!'});
            return;
        }
// Saving the session and having user logged in if the correct info is entered
        req.session.save(()=> {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message : 'You are now logged in!'})
        });
    
    } catch (err) {
        res.status(400).json(err);
    }
});

// Post route to log out
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(()=> {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;