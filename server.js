const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB connect
mongoose.connect(
  "mongodb+srv://tuffy0984327287_db_user:JDTQCN5IDV5U5rtc@tuffy.kdlef7w.mongodb.net/finance?retryWrites=true&w=majority"
)

.then(() => {
  console.log("MongoDB connected!");
})

.catch((err) => {
  console.log(err);
});


// User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model("User", userSchema);
const transactionSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true
  },

  type: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  date: {
    type: String,
    required: true
  }

});

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);


// register
app.post("/register", async (req, res) => {

  const { username, password } = req.body;

  let exists = await User.findOne({
    username
  });

  if (exists) {

    return res.json({
      success: false,
      message: "User already exists"
    });

  }

  let user = new User({
    username,
    password
  });

  await user.save();

  res.json({
    success: true,
    message: "Register success"
  });

});


// login
app.post("/login", async (req, res) => {

  const { username, password } = req.body;

  let user = await User.findOne({
    username,
    password
  });

  if (user) {

    res.json({
      success: true,
      message: "Login success"
    });

  } else {

    res.json({
      success: false,
      message: "Wrong username or password"
    });

  }

});

app.post("/add-transaction", async (req, res) => {

  const {
    username,
    type,
    category,
    amount,
    date
  } = req.body;


  let transaction = new Transaction({

    username,

    type,

    category,

    amount,

    date

  });


  await transaction.save();


  res.json({
    success: true
  });

});

app.get("/summary/:username", async (req, res) => {

  let username =
    req.params.username;


  let transactions =
    await Transaction.find({
      username
    });


  let income = 0;
  let expense = 0;


  transactions.forEach((item) => {

    if (item.type === "income") {

      income += item.amount;

    }


    if (item.type === "expense") {

      expense += item.amount;

    }

  });


  res.json({

    income,

    expense,

    balance:
      income - expense

  });

});

app.get("/monthly/:username/:month", async (req, res) => {

  let username =
    req.params.username;


  let month =
    req.params.month;


  let transactions =
    await Transaction.find({
      username
    });


  let income = 0;
  let expense = 0;


  transactions.forEach((item) => {

    if (
      item.date &&
      item.date.startsWith(month)
    ) {

      if (
        item.type === "income"
      ) {

        income +=
          item.amount;

      }


      if (
        item.type === "expense"
      ) {

        expense +=
          item.amount;

      }

    }

  });


  res.json({

    income,

    expense,

    balance:
      income - expense

  });

});

app.delete("/transaction/:id", async (req, res) => {

  let id =
    req.params.id;


  await Transaction.findByIdAndDelete(
    id
  );


  res.json({
    success: true
  });

});

app.get("/transactions/:username", async (req, res) => {

  let username =
    req.params.username;


  let transactions =
    await Transaction.find({
      username
    });


  res.json(
    transactions
  );

});

// test
app.get("/", (req, res) => {
  res.send("Finance backend running");
});


// start server
const PORT =
  process.env.PORT || 3000;


app.listen(PORT, () => {

  console.log(
    "Server running on port " +
    PORT
  );

});;