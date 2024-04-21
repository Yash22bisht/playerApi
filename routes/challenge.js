const express = require('express');
const router = express.Router();
const excel = require('exceljs');


router.get('/challenge',(req,res)=>{
    res.render('challenge')
  })

router.post('/challenge', async (req, res) => {
    var { player, opponent } = req.body;

    let workbook = new excel.Workbook();
    await workbook.xlsx.readFile('users.xlsx');

    let worksheet = workbook.getWorksheet(1);
    let playerUser = false;
    let opponentUser = false;
    worksheet.eachRow((row, rowNumber) => {
        // const user = row.values;
        const [rowId] = row.values.slice(1, 2);
        if (rowId == player) {
            playerUser=true;
            row.getCell(3).value = "sent";
            row.getCell(6).value = opponent;
            return false;
        }
    })
    worksheet.eachRow((row, rowNumber) => {
        // const user = row.values;
        const [rowId] = row.values.slice(1, 2);
        if (rowId == opponent) {
            opponentUser=true;
            row.getCell(3).value = "received";
            row.getCell(7).value = player;
            return false;
        }
    })
    await workbook.xlsx.writeFile('users.xlsx');
    if (playerUser && opponentUser) {
        res.render('end');
    }
})


module.exports = router;