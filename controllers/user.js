const User = require("../models/user")
const Role = require("../models/role")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendToken } = require("../middleware/user_auth")

// @Route POST request
// @desc request to get user details
// @access publc access
exports.userRegistration = async (req, res) => {
    const { full_name, email, phone_number, password, address, role } = req.body;
    let userSearch = await User.find({ email })
    if(userSearch) return res.status(400).json({ success: false, msg: 'User already exists'})

    let user = await User.create({ full_name, email,  password, phone_number, address, role })

    let msg= 'You are signed up'
    sendToken(user, res, 201, msg);
      
}

// @Route POST request
// @desc request for user login
// @access publc access
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email }).select("+password");
        if(!user) 
        res
        .status(404)
        .json({ success: false, msg: "You are not registered yet" });

        // Check if email and password matches
        if(!(await user.comparePassword(password, user.password))){
            return res.status(401).json({ success: false, msg: 'Invalid password'})
        }
        let msg= 'You are logged in'
        
        sendToken(user, res, 201, msg);

    } catch(err){
        res.status(500).json({
            message: "Server Error"
        });
    }

}

// @Route POST request
// @desc request for password change
// @access public access
exports.logUserOut = async (req, res, next) => {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    })
  
    res.status(200).json({
      success: true,
      msg: "You have been logged out",
      data: {}
    })
  }

// @Route GET request
// @desc request to get registered user
// @access private access
//NOTE: this is not working
//TODO: Refactor this to get the user by Id
exports.getUserProfile = async (req, res) => {
    try{
        res.status(200).json({
            user: req.user
        })

    } catch(err){
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

// @Route GET request
// @desc request to get registered user
// @access private access
exports.getUserProfileById = async (req, res) => {
    
    try{
        const user = await User.findOne({ id: req.userId });
    
        res.status(200).json({ success: true, msg: "Data retrieved successfully", data: user});

    } catch(err){
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

// @Route GET request
// @desc request to get all registered user
// @access private access restricted to admin role
exports.getAllUserProfiles = async (req, res) => {
    // check if the user role is an admin
    if(req.user.role === "user") {
        return res.status(400).json({ success: false, msg: "You are not permitted to perform this operation"})
    }
    

    else if(req.user.role === "admin"){
        try{
            const user = await User.find()
            if(!user) return res.status(400).json({ success: false, msg: 'No registered user, yet'})

            await res.status(200).json({ success: true, data: user})

        } catch(err){
            console.error(err);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
}

// @Route POST request
// @desc request to edit user user
// @access private access
exports.editUserProfile = async(req, res) => {
    try{

        const user = await User.findOne({ email: req.user.email }).select("+password");
        if(!user) return res.status(401).json({ success: false, msg: 'User not found'});

        user.full_name = req.body.full_name;
        user.phone_number = req.body.phone_number;
        user.email = req.body.email;
        user.address = req.body.address;
        user.role = req.body.role;

        await user.save();
        res.status(200).json({ success: true, msg: "User updated successfully" })
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

// @Route POST request
// @desc request to edit user user
// @access private access
exports.editUserById = async (req, res) => {
    try{

        const user = await User.findOne({ id: req.userId});

        user.full_name = req.body.full_name;
        user.phone_number = req.body.phone_number;
        user.email = req.body.email;
        user.address = req.body.address;
        user.role = req.body.role;

    } catch (err){
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
}