const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');

router.post('/:storyId/add', chapterController.addChapter);
router.get('/:storyId/all', chapterController.getChapters);
router.put('/:storyId/:chapterId/update', chapterController.updateChapter);
router.delete('/:storyId/:chapterId/delete', chapterController.deleteChapter);

module.exports = router;
