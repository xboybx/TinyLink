const express = require('express');
const router = express.Router();
const {
  createLink,
  getLinks,
  getLinkStats,
  deleteLink,
  redirectToTarget
} = require('../controllers/linkController');

router.post('/api/links', createLink);//Route to create a new shortened link
router.get('/api/links', getLinks);//Route to get all links
router.get('/api/links/:code', getLinkStats);//Route to get stats for a specific link
router.delete('/api/links/:code', deleteLink);//Route to delete a specific link
router.get('/:code', redirectToTarget);//Route to redirect to the target URL

//At :code part its like a paceholder ,we can write any thing there the wrttten will be avaliabe in req.params.code in controller

module.exports = router;