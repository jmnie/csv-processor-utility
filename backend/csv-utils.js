const csvParser = require('csv-parser');
const fs = require('fs');

const processCSV = (filePath, callback) => {
  const results = {};

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => {
      let { Name, Date: dateString, Value } = data; 

      if (typeof Name === 'undefined') return;
      Name = Name.trim();
      if (isNaN(Value) || Value === '') return;

      if (!results[Name]) {
        results[Name] = [];
      }

      results[Name].push({ date: new Date(dateString), value: parseFloat(Value) });  // 使用重命名后的变量dateString
    })
    .on('end', () => {
      let maxIncrease = null;
      let maxCompany = null;
    
      for (const [company, records] of Object.entries(results)) {
        // 如果记录少于2条，则跳过这个公司
        if (records.length < 2) continue;
        const sortedRecords = records.sort((a, b) => a.date - b.date);
  
        const first = sortedRecords[0].value;
        const last = sortedRecords[sortedRecords.length - 1].value;
        const increase = last - first;

        if (increase > 0 && (maxIncrease === null || increase > maxIncrease)) {
          maxIncrease = increase;
          maxCompany = company;
        }
      }

      if (maxIncrease !== null) {
        callback(null, { company: maxCompany, incremental_value: maxIncrease.toFixed(2) });
      } else {
        callback(null, {}); 
      }
    })
    .on('error', (err) => {
      callback(err);
    });
};

module.exports = { processCSV };
