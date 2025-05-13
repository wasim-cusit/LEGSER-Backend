const express = require('express');
const router = express.Router();
const chatController = require("../controllers").chat;

// Send a new message
router.post('/send-message', chatController.sendMessage);

router.get('/partners', chatController.getPartners);

router.get('/', chatController.getMessages);

// Mark a message as seen
router.patch('/seen/:messageId', chatController.markSeen);

// Delete message for current user (from me)
router.delete('/message/delete-for-me', chatController.deleteForMe);

// Delete message for everyone
router.delete('/message/delete-for-everyone', chatController.deleteForEveryone);

// Clear chat for one user
router.post('/clear-chat', chatController.clearChat);

module.exports = router;
