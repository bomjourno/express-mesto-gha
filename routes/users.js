const router = require("express").Router();

const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getMe,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getMe);
router.get("/:userId", getUserById);
router.patch("/me", updateUserProfile);
router.patch("/me/avatar", updateUserAvatar);

module.exports = router;
