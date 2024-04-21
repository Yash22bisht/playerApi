const express = require('express');
const router = express.Router();
const excel = require('exceljs');

// Define a route to handle the Excel file
router.get('/excelData', async (req, res) => {
  try {
    // Load the Excel workbook
    const workbook = new excel.Workbook();
    await workbook.xlsx.readFile('users.xlsx'); // Adjust the file path as needed

    // Read the first worksheet
    const worksheet = workbook.getWorksheet(1);

    // Convert the worksheet data to JSON format
    const jsonData = [];
    worksheet.eachRow((row) => {
      const rowData = {};
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        rowData[colNumber] = cell.value;
      });
      jsonData.push(rowData);
    });

    // Send the JSON data in the response
    res.json(jsonData);
  } catch (error) {
    console.error('Error reading Excel file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
