let currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  window.location.href = "login.html";
}


/* ADD EXPENSE */
let expenseForm =
  document.getElementById(
    "expenseForm"
  );


if (expenseForm) {

  expenseForm.addEventListener(

    "submit",

    async function(e) {

      e.preventDefault();


      let category =
        document.getElementById(
          "expenseCategory"
        ).value;


      let amount =
        Number(
          document.getElementById(
            "expenseAmount"
          ).value
        );


      let date =
        document.getElementById(
          "expenseDate"
        ).value;


      let response =
        await fetch(

          "http://localhost:3000/add-transaction",

          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              username:
                currentUser,

              type:
                "expense",

              category,

              amount,

              date

            })

          }

        );


      let result =
        await response.json();


      if (result.success) {

        alert(
          "Expense added!"
        );

        location.reload();

      }

    }

  );

}



/* ADD INCOME */
let incomeForm =
  document.getElementById(
    "incomeForm"
  );


if (incomeForm) {

  incomeForm.addEventListener(

    "submit",

    async function(e) {

      e.preventDefault();


      let category =
        document.getElementById(
          "incomeCategory"
        ).value;


      let amount =
        Number(
          document.getElementById(
            "incomeAmount"
          ).value
        );


      let date =
        document.getElementById(
          "incomeDate"
        ).value;


      let response =
        await fetch(

          "http://localhost:3000/add-transaction",

          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              username:
                currentUser,

              type:
                "income",

              category,

              amount,

              date

            })

          }

        );


      let result =
        await response.json();


      if (result.success) {

        alert(
          "Income added!"
        );

        location.reload();

      }

    }

  );

}



/* HISTORY */
let incomeList =
  document.getElementById(
    "incomeList"
  );


let expenseList =
  document.getElementById(
    "expenseList"
  );


if (
  incomeList &&
  expenseList
) {

  loadHistory();

}


async function loadHistory() {

  let response =
    await fetch(

      "http://localhost:3000/transactions/" +
      currentUser

    );


  let data =
    await response.json();


  incomeList.innerHTML =
    "";

  expenseList.innerHTML =
    "";


  data.forEach(

    (item) => {

      let li =
        document.createElement(
          "li"
        );


      let text =
        document.createElement(
          "span"
        );


      text.textContent =

        item.category +

        " : $" +

        item.amount +

        " | Date: " +

        item.date;


      let deleteBtn =
  document.createElement(
    "button"
  );


deleteBtn.textContent =
  "Delete";


deleteBtn.classList.add(
  "delete-btn"
);


deleteBtn.addEventListener(

  "click",

  async function () {

    await fetch(

      "http://localhost:3000/transaction/" +
      item._id,

      {
        method: "DELETE"
      }

    );


    location.reload();

  }

);


li.appendChild(
  text
);


li.appendChild(
  deleteBtn
);


      if (
        item.type ===
        "income"
      ) {

        incomeList.appendChild(
          li
        );

      }

      else {

        expenseList.appendChild(
          li
        );

      }

    }

  );

}



/* SEARCH */
let searchInput =
  document.getElementById(
    "searchInput"
  );


if (searchInput) {

  searchInput.addEventListener(

    "input",

    function () {

      let keyword =
        searchInput.value
        .toLowerCase();


      let items =
        document.querySelectorAll(
          "li"
        );


      items.forEach(

        item => {

          let text =
            item.textContent
            .toLowerCase();


          item.style.display =

            text.includes(
              keyword
            )

            ? "flex"

            : "none";

        }

      );

    }

  );

}



/* TOTAL */
let i =
  document.getElementById(
    "incomeTotal"
  );


let e =
  document.getElementById(
    "expenseTotal"
  );


let b =
  document.getElementById(
    "balance"
  );


if (
  i &&
  e &&
  b
) {

  loadSummary();

}


async function loadSummary() {

  let response =
    await fetch(

      "http://localhost:3000/summary/" +
      currentUser

    );


  let result =
    await response.json();


  i.textContent =
    result.income;


  e.textContent =
    result.expense;


  b.textContent =
    result.balance;

}

/* MONTHLY */
let monthPicker =
  document.getElementById(
    "monthPicker"
  );


if (monthPicker) {

  let today =
    new Date()
    .toISOString()
    .slice(0, 7);


  monthPicker.value =
    today;


  loadMonthly(
    today
  );


  monthPicker.addEventListener(

    "change",

    function () {

      loadMonthly(
        this.value
      );

    }

  );

}


async function loadMonthly(
  month
) {

  let response =
    await fetch(

      "http://localhost:3000/monthly/" +

      currentUser +

      "/" +

      month

    );


  let result =
    await response.json();


  let i =
    document.getElementById(
      "monthIncome"
    );


  let e =
    document.getElementById(
      "monthExpense"
    );


  let b =
    document.getElementById(
      "monthBalance"
    );


  if (i) {

    i.textContent =
      result.income;

  }


  if (e) {

    e.textContent =
      result.expense;

  }


  if (b) {

    b.textContent =
      result.balance;

  }

}



/* LOGOUT */
function logout() {

  localStorage.removeItem(
    "currentUser"
  );


  window.location.href =
    "login.html";

}


let welcome =
  document.getElementById(
    "welcomeText"
  );


if (
  welcome &&
  currentUser
) {

  welcome.textContent =

    "Welcome, " +

    currentUser +

    "!";

}