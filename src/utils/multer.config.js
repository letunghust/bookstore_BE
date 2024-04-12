const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ tạm thời file trên server
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Thư mục lưu trữ tạm thời
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file duy nhất
  }
});

// Khởi tạo đối tượng multer
const upload = multer({ storage: storage });

module.exports = upload;