const jwt = require('jsonwebtoken');
const User = require("../models/user")

  // // Verify token
  exports.authorize = async (req, res, next) =>{
    try {
      let token;
      if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
      } else if(req.cookies.token) {
          token = req.cookies.token;
      }

      // Check if no token is being sent
      if (!token) {
        return res.status(401).json({ msg: 'Unauthorized'})
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id).select("+password")
        if(!currentUser) {
          return res.status(401).json({ msg: 'User has been logged out'})
        }   
        req.user = currentUser
        req.user.password = undefined
        next()
    } catch (err) {
      return res.status(401).json({ msg: err})
  }
}

exports.verifyTokenById = async(req, res, next) => {
  try {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      token = req.headers.authorization.split(" ")[1];
    } else if(req.cookies.token) {
        token = req.cookies.token;
    }
    // Check if no token is being sent
    if (!token) {
      return res.status(401).json({ msg: 'Unauthorized'});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err) return res.status(401).json({success: false, msg: "Token expireds"});

      req.userId = decoded.id;
      next()
    })
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const currentUser = await User.findById(decoded.id).select("+password")
    //   if(!currentUser) {
    //     return res.status(401).json({ msg: 'User has been logged out'})
    //   }   
    //   req.user = currentUser
    //   req.user.password = undefined
    //   next()
  } catch (err) {
    return res.status(401).json({ msg: err})
}
}

exports.sendToken = async (user, res, statusCode, msg) => {
    const token = await user.getJwtToken();

    const cookieOption = {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 1000),
    };
    if (process.env.NODE_ENV === "production") {
      // only on https else user won't be assigned any cookie
      cookieOption.secure = true;
    }
    user.password = undefined;
  
    res.cookie("token", token, cookieOption).status(statusCode).json({
      success: true,
      msg: msg,
      id: user._id,
      token
    });
  };

