const express = require("express");
const router = express.Router();
const suratOnUsersController = require("../controllers/surat_on_users.controller");

// SuratOnUsers routes
router.get("/:userId", suratOnUsersController.getSuratForUser);
router.put("/:userId/:suratId/read", suratOnUsersController.markSuratAsRead);
router.put(
  "/:userId/:suratId/download",
  suratOnUsersController.markSuratAsDownloaded
);

module.exports = router;
