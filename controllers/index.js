const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

router.use('/', apiRoutes);
router.use('/', homeRoutes);

module.exports = router;