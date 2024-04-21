const express = require("express");
const router = express.Router();
const excel = require("exceljs");


router.get('/login',(req,res)=>{
  res.render('login')
})

router.use("/login", async (req, res, next) => {
  const { email, Password } = req.body;

  let workbook = new excel.Workbook();
  await workbook.xlsx.readFile("users.xlsx");

  let worksheet = workbook.getWorksheet(1);

  let userFound = false;
  let data = {};

  worksheet.eachRow((row, rowNumber) => {
    // const user = row.values;
    const [chal, rowEmail, rowPassword, , from] = row.values.slice(3, 8);
    if (rowEmail == email && rowPassword == Password) {
      userFound = true;
      data = {
        chal: chal,
        from: from,
      };
      return false;
    }
  });
  if (userFound) {
    console.log("user found");
    req.data = data;
    // console.log(data.chal);
  } else {
    res.send("user not found.");
  }
  next();
});

router.post("/login", function (req, res) {
  var data = req.data;
  // Render the dashboard view with the player data attached to the request object
  res.render("dashboard", { data: data });
  console.log(req.data);
});

router.get("/accept", (req, res, next) => {
  res.render("response", { resp: "accept" });
});
router.get("/decline", (req, res, next) => {
  res.render("response", { resp: "decline" });
});

router.post("/accept", async (req, res, next) => {
  const { player } = req.body;
  let opponent = null;

  try {
    // Update challenge status for the player

    let workbook = new excel.Workbook();
    await workbook.xlsx.readFile("users.xlsx");

    let worksheet = workbook.getWorksheet(1);
    let playerUser = false;
    let opponentUser = false;
    worksheet.eachRow((row, rowNumber) => {
      // const user = row.values;
      const [rowId, , , , , , opp] = row.values.slice(1, 8);
      const [opponentId] = row.values.slice(7, 8);
      if (rowId == player) {
        opponent = opponentId;
        playerUser = true;
        row.getCell(3).value = "accepted";
        return false;
      }
    });
    console.log(opponent);

    worksheet.eachRow((row, rowNumber) => {
      // const user = row.values;
      const [rowId] = row.values.slice(1, 2);
      if (rowId == opponent) {
        opponentUser = true;
        row.getCell(3).value = "accepted";
        return false;
      }
    });
    await workbook.xlsx.writeFile("users.xlsx");
    if (playerUser && opponentUser) {
      res.render("end");
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/decline", async (req, res, next) => {
  const { player } = req.body;
  try {
    let workbook = new excel.Workbook();
    await workbook.xlsx.readFile("users.xlsx");

    let worksheet = workbook.getWorksheet(1);
    let playerUser = false;
    let opponentUser = false;
    worksheet.eachRow((row, rowNumber) => {
      // const user = row.values;
      const [rowId, , , , , , opp] = row.values.slice(1, 8);
      const [opponentId] = row.values.slice(7, 8);
      if (rowId == player) {
        opponent = opponentId;
        playerUser = true;
        row.getCell(3).value = null;
        row.getCell(7).value = null;
        return false;
      }
    });
    console.log(opponent);

    worksheet.eachRow((row, rowNumber) => {
      // const user = row.values;
      const [rowId] = row.values.slice(1, 2);
      if (rowId == opponent) {
        opponentUser = true;
        row.getCell(3).value = null;
        row.getCell(6).value = null;

        return false;
      }
    });
    await workbook.xlsx.writeFile("users.xlsx");
    if (playerUser && opponentUser) {
      res.render("end");
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

// router.use('/check', async function(req, res, next) {
//   const { email, Password } = req.body;

//   try {
//     const player = await User.findOne({ email: email, password: Password });
//     console.log(player);

//     if (player) {
//       req.data = {
//         chal: player.challenge,
//         from: player.Challenged_from
//       };
//     }
//     next(); // Call next to proceed to the next middleware/route
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// router.get('/accept',(req,res,next)=>{
//   res.render('response',{resp:"accept"})
// })
// router.get('/decline',(req,res,next)=>{
//   res.render('response',{resp:"decline"})
// })
// router.post('/accept', async (req, res, next) => {
//   const { player } = req.body;

//   try {
//       // Update challenge status for the player
//       const playerUser = await User.findOneAndUpdate(
//           { _id: player },
//           { $set: { challenge: "accepted" } },
//           { new: true }
//       );

//       // Get the opponent ID
//       const opp = playerUser.Challenged_from;

//       // Update challenge status for the opponent
//       const oppUser = await User.findOneAndUpdate(
//           { _id: opp },
//           { $set: { challenge: "accepted" } },
//           { new: true }
//       );
//       res.render('end')
//       // Send a success response
//       res.status(200).json({ message: 'Challenge accepted successfully.' });
//   } catch (error) {
//       // Handle errors
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// router.post('/decline', async (req, res, next) => {
//   const { player } = req.body;

//   try {
//       // Update challenge status for the player
//       const playerUser = await User.findOneAndUpdate(
//           { _id: player },
//           { $set: { challenge: null ,Challenged_from: 0 } },
//           { new: true }
//       );

//       // Get the opponent ID
//       const opp = playerUser.Challenged_from;

//       // Update challenge status for the opponent
//       const oppUser = await User.findOneAndUpdate(
//           { _id: opp },
//           { $set: { challenge: null , Challenged_to:0 } },
//           { new: true }
//       );
//       res.render('end')
//       // Send a success response
//       res.status(200).json({ message: 'Challenge accepted successfully.' });
//   } catch (error) {
//       // Handle errors
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// router.post('/check', function(req, res, next) {
//   // Render the dashboard view with the player data attached to the request object
//   res.render('dashboard', { data: req.data });
// });

// // router.get('/accept', function(req, res, next) {
// //   // Render the accept view with the player data attached to the request object
// //   // res.render('accept', { data: req.data });
// //   console.log(req.data );

// // });

// module.exports = router;
