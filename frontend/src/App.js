import React, { useState } from 'react';
import './App.css';

function App() {
  const [uploadResult, setUploadResult] = useState('');
  const [file, setFile] = useState(null);  // 添加一个状态来保存文件

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);  // 当用户选择文件时，更新状态
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (!file) {
      alert('Please select a file first!');
      return;
    }
    formData.append('file', file);  // 将文件添加到formData中
    
    const apiUrl = process.env.REACT_APP_API || "http://127.0.0.1:3001/api/process-stock-data";  // 确保已经设置了环境变量

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      console.log("response");
      console.log(response)

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      // 检查result.data是否为空
      if (result.data) {
        // 处理并显示数据
        const displayData = `公司: ${result.data.company}, 股价增值: ${result.data["incremental-value"]}`;
        setUploadResult(displayData);
      } else {
        // 如果data为空，则显示特定消息
        setUploadResult("没有对应的结果");
      }
    } catch (error) {
      console.error('Error:', error);
      setUploadResult('API Return Error: ' + error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Process Stock Data File</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="file" name="file" accept=".csv" onChange={handleFileChange} />  {/* 添加 onChange 事件处理器 */}
          <button type="submit">Upload File</button>
        </form>
        {uploadResult && (
          <div>
            <h3>Processed Result:</h3>
            <pre>{uploadResult}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
