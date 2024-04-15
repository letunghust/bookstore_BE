// const multer = require('multer');
// const path = require('path');

// // Cấu hình lưu trữ tạm thời file trên server
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log('destination folder:', 'upload/')
//     cb(null, 'uploads/'); // Thư mục lưu trữ tạm thời
//   },
//   filename: function (req, file, cb) {
//     const uniqueFilename = Date.now() + path.extname(file.originalname);
//     console.log('unique filename: ', uniqueFilename); 
//     cb(null, uniqueFilename); // Đặt tên file duy nhất
//   }
// });

// // Định nghĩa các loại file có thể upload
// const fileFilter = (req, file, cb) => {
//   console.log('checking file type:', file.mimetype);
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     console.log('File type accepted');
//     cb(null, true);
//   } else {
//     console.log('File type not accepted');
//     cb(new Error('File type not accepted'), false);
//   }
// };

// // Khởi tạo đối tượng multer
// const upload = multer({ 
//   storage: storage,
//   fileFilter: fileFilter
// });

// console.log('multer configured successfully!'); 

// module.exports = upload;

const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);  
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});