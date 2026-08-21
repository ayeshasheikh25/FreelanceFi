const AuthModel = require("../model/AuthASchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.createProfile = async (req, res) => {
  try {
    const { walletAddress, role, name, bio, skills, profileCompleted } =
      req.body;
    console.log(req.body);

    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address missing" });
    }

    const isUserExist = await AuthModel.findOne({ walletAddress });
    if (isUserExist) {
      return res.status(200).json({ exists: true, user: isUserExist });
    }

    const newUser = await AuthModel.create({
      walletAddress,
      role,
      name,
      bio,
      skills,
      profileCompleted,
    });

    const token = jwt.sign(
      {
        walletAddress,
        role,
      },
      process.env.secret_key,
      {
        expiresIn: "30m",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,     
      sameSite: "None", 
      maxAge: 30 * 60 * 1000,
    });

    res.status(201).json({ message: "User is created", newUser });
  } catch (err) {
    res.status(500).json({ message: "Error during login" });
  }
};

exports.checkUser = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const user = await AuthModel.findOne({ walletAddress });
    if (user) {
      const token = jwt.sign(
        {
          walletAddress,
        },
        process.env.secret_key,
        {
          expiresIn: "30m",
        },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true, 
        sameSite: "None", 
        maxAge: 30 * 60 * 1000,
      });

      return res.status(200).json({ exists: true, user });
    }

    return res.status(404).json({ exists: false });
  } catch (err) {
    res.status(500).json({
      message: "Error checking user",
    });
  }
};

exports.fetchUsers = async (req, res) => {
  try {
    const address = req.params.address;
    const user = await AuthModel.findOne({ walletAddress: address });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    res.stats(500).json({ message: "Error during fetching users", err });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "logout" });
  } catch (err) {
    console.log(err);
  }
};

exports.ratingUsers = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { ratings } = req.body;
    console.log(walletAddress , ratings)
    const updatedUser = await AuthModel.findOneAndUpdate({walletAddress}, {$push:{rating: ratings}}, {new: true})
    res.status(200).json({
      message: "Rating updated successfully",
      result: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.fetchFreelancer = async(req, res)=>{
 try{
  const {walletAddress} = req.params
  console.log(walletAddress)
  const user = await AuthModel.aggregate([
    {
      $match: {
        walletAddress: walletAddress.toLowerCase()
      }
    },
    {
      $project: {
        _id:0,
        walletAddress:1,
        name:1,
        role:1,
        bio:1,
        skills:1,
        avgRating:{
          $avg: "$rating"
        }
      }
    }
  ])

  if(user.length === 0){
    console.log(user)
    return res.status(404).json({message: "User not found"})
  }
  console.log(user)
  return res.status(200).json(user)
 }catch(err){
   res.status(500).json({ message: "Server Error" });
 }

}
