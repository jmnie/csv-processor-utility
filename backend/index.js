const express = require('express');
const multer = require('multer');
const fs = require('fs'); 
const { processCSV } = require('./csv-utils');
const app = express();
const cors = require('cors');
const port = 3001;
const upload = multer({ dest: 'uploads/' });
app.use(cors());

const respondJSON = (res, code, message, data = {}) => {
  res.status(code).json({
    code,
    message,
    data
  });
};

app.post('/api/process-stock-data', upload.single('file'), (req, res, next) => {
  // 首先检查是否上传了文件
  if (!req.file) {
    console.log("File not uploaded.")
    return respondJSON(res, 400, "No file uploaded");
  }

  // 然后检查文件类型
  if (req.file.mimetype !== 'text/csv') {
    fs.unlink(req.file.path, unlinkErr => { // 删除非CSV文件
      if (unlinkErr) {
        console.error(`Error deleting file ${req.file.path}:`, unlinkErr);
      }
    });
    return respondJSON(res, 400, "Please upload a .csv file.");
  }

  const filePath = req.file.path;
  processCSV(filePath, (err, result) => {
      try {
        if (err) {
          console.log(`Service Process File met error: ${err}`);
          return respondJSON(res, 500, "Service encountered an error");
        }
        console.log("Process Request successfully.");
        respondJSON(res, 200, "Service returned result successfully", { company: result.company, "incremental-value": result.incremental_value });
      } finally {
        fs.unlink(filePath, unlinkErr => {
          if (unlinkErr) {
            console.error(`Error deleting file ${filePath}:`, unlinkErr);
          }
        });
      }
  });
});


app.use((err, req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
  console.error(err.stack); // 打印错误栈信息到控制台

  // 检查是否是Multer的错误
  if (err instanceof multer.MulterError) {
      console.log("Multer error: " + err.message)
      return respondJSON(res, 400, "Multer error: " + err.message);
  }

  if (!req.file || req.file.mimetype !== 'text/csv') {
    console.log("File format is not correct.")
    return res.status(400).json({ error: 'Please upload a .csv file.' });
  }

  return respondJSON(res, 500, "Internal Server Error");
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
