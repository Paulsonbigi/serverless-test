const express = require("express")
const router = express.Router()

const { userRegistration, loginUser, getUserProfile, editUserProfile, getUserProfileById, logUserOut, getAllUserProfiles } = require("../../controllers/user")
const { authorize, verifyTokenById } = require("../../middleware/user_auth")

// post routes
router.post("/user_registration", userRegistration)
router.post("/user_login", loginUser)
router.post("/user_logout", logUserOut)

// get routes
router.get("/all_users_details", authorize, getAllUserProfiles)
router.get("/user_details", authorize, getUserProfile)
router.get("/user_details_by_id", verifyTokenById, getUserProfileById)

// patch routes
router.patch("/edit_user", authorize, editUserProfile)

module.exports = router