const express = require('express');
const router = express.Router();
const storiesController = require('../controllers/storiesController');

// Define routes for stories
router.post('/add', storiesController.addStory);
router.get('/all', storiesController.getAllStories);
router.get('/search', storiesController.searchStory);
router.get('/filter', storiesController.filterStories);
router.put('/:storyId/update', storiesController.updateStory);
router.delete('/:storyId/delete', storiesController.deleteStory);

// Export the router
module.exports = router;
