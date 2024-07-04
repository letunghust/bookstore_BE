const User = require("../models/User");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/sendMail");
const multer = require('../utils/multer.config');
const cloudinary = require('../utils/cloudinary.config');

// [POST] sign up user
const signup = async (req, res) => {
  const { name, surname, phone, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      surname,
      phone,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//[POST] log in
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if(user.isBlocked) {
      return res.status(403).json({message: 'User is blocked'});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // trả về token
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [PATCH] update user
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [PATCH] update role user of admin 
const updateUserRole = async (req, res) => {
  const userId = req.params.id;
  const {role} = req.body;

  if(!['user', 'cashier', 'admin'].includes(role)) {
    return res.status(400).json({message: 'Invalid role'});
  }

  try {
    const user = await User.findByIdAndUpdate(userId, {role}, {new: true});

    if(!user) {
      return res.status(404).json({message: "User not found"});
    }

    res.json(user);
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

//[GET] get all user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//[GET] get user by id
const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [POST] change password
const changePassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra mật khẩu hiện tại có đúng không
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Mã hóa mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới của người dùng
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [POST] forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = user.createPasswordChangedToken();

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    const html = `Click vào link này để thay đổi mật khẩu. Link sẽ hết hạn sau 15 phút. <a href="${resetUrl}">${resetUrl}</a>`;

    await sendMail(email, ` ${html}`);

    return res.status(200).json({ success: true, resetToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// [PUT] reset password
const resetPassword = async (req, res) => {
  try {
    // const {token} = req.params;
    const token = req.query.token;
    const { newPassword } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      // passwordResetExpires: {$gt: Date.now()},
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// [PATCH] block user
const blockUser = async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User block status updated', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// [POST] upload avatar 
const uploadAvatar = async (req, res) => {
  const userId = req.user._id;
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
    });

    const user = await User.findById(userId);
    user.avatar = result.secure_url;
    await user.save();

    res.status(200).json({message: 'Avatar uploaded successfully', avatar: result.secure_url});
  } catch(error) {
    console.log('Error uploading avatar: ', error);
    res.status(500).json({error: 'Failed to upload avatar'});
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  changePassword,
  forgotPassword,
  resetPassword,
  blockUser,
  uploadAvatar,
};
