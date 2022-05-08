const withAuth = (req, res, next) => {
    if (!req.session.ligged_in) {
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = withAuth;