const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
/**
 * 
 * @name registerUserController
 * @description Controller to handle user registration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @access Public
 */

async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        });
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this username or email"
        });
    }
    


const hash = await bcrypt.hash(password,10)

const user = await userModel.create({
    username,
    email,
    password:hash
})


const token = jwt.sign(
    {id: user._id, username: username},
    process.env.JWT_SECRET,
    { expiresIn: "1d"}
)
 res.cookie("token", token)

 res.status(201).json({
    message: "user registed successfully",
    user:{
        id: user._id,
        username: user.username,
        email: user.email
    },
 })


}


/**
 * @name loginUserController
 * @description Controller to handle user login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @access Public
 */


async function loginUserController(req, res) {
    const {email , password } = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message : "invalid email or password"
        })
    }
    
    const ispasswordVaild= await bcrypt.compare(password, user.password)

    if(!ispasswordVaild){
        return res.status(400).json({
            message : "invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username},
        process.env.JWT_SECRET,
        { expiresIn: "1d"}



    )
     res.cookie("token", token)
     res.status(200).json({
        message:"User loggedIn successfully",
        user:{
            id:user._id,
            username: user.username,
            email:user.email
        }

     })
}


/**
 * @name logoutUserController
 * @description Controller to handle user logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @access Private
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token
     if(token){
        await tokenBlacklistModel.create({token})
     }
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    });
}

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)

    res.status(200).json({

        message:"user details fetch successfully",
        user:{
            id: user._id,
            username:user.username,
            email: user.email

        }
    })

}


module.exports = { registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
 }