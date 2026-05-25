let currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  window.location.href = "login.html";
}

const API_URL = "https://expense-tracker-s1c1.onrender.com";

/* ADD EXPENSE */
let expenseForm = document.getElementById("expenseForm");

if (expenseForm) {
  expenseForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    let description = document.getElementById("expenseDescription").value;
    let category = document.getElementById("expenseCategory").value;
    let amount = Number(document.getElementById("expenseAmount").value);
    let date = document.getElementById("expenseDate").value;

    if (!category) {
      alert("Please select a category.");
      return;
    }

    let response = await fetch(API_URL + "/add-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: currentUser,
        type: "expense",
        description: description,
        category: category,
        amount: amount,
        date: date
      })
    });

    let result = await response.json();

    if (result.success) {
      alert("Expense added!");
      location.reload();
    }
  });
}

/* ADD INCOME */
let incomeForm = document.getElementById("incomeForm");

if (incomeForm) {
  incomeForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    let category = document.getElementById("incomeCategory").value;
    let amount = Number(document.getElementById("incomeAmount").value);
    let date = document.getElementById("incomeDate").value;

    let response = await fetch(API_URL + "/add-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: currentUser,
        type: "income",
        category: category,
        amount: amount,
        date: date
      })
    });

    let result = await response.json();

    if (result.success) {
      alert("Income added!");
      location.reload();
    }
  });
}

/* HISTORY */
let incomeList = document.getElementById("incomeList");
let expenseList = document.getElementById("expenseList");

if (incomeList && expenseList) {
  loadHistory();
}

async function loadHistory() {
  let response = await fetch(API_URL + "/transactions/" + currentUser);
  let data = await response.json();

  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  data.forEach((item) => {
    let li = document.createElement("li");
    let text = document.createElement("span");

    if (item.type === "expense") {
      text.textContent =
        (item.description || "No description") +
        " | Category: " +
        item.category +
        " : $" +
        item.amount +
        " | Date: " +
        item.date;
    } else {
      text.textContent =
        item.category +
        " : $" +
        item.amount +
        " | Date: " +
        item.date;
    }

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", async function () {
      await fetch(API_URL + "/transaction/" + item._id, {
        method: "DELETE"
      });

      location.reload();
    });

    li.appendChild(text);
    li.appendChild(deleteBtn);

    if (item.type === "income") {
      incomeList.appendChild(li);
    } else {
      expenseList.appendChild(li);
    }
  });
}

/* SEARCH */
let searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    let keyword = searchInput.value.toLowerCase();
    let items = document.querySelectorAll("li");

    items.forEach(item => {
      let text = item.textContent.toLowerCase();
      item.style.display = text.includes(keyword) ? "flex" : "none";
    });
  });
}

/* TOTAL */
let i = document.getElementById("incomeTotal");
let e = document.getElementById("expenseTotal");
let b = document.getElementById("balance");

if (i && e && b) {
  loadSummary();
}

async function loadSummary() {
  let response = await fetch(API_URL + "/summary/" + currentUser);
  let result = await response.json();

  i.textContent = result.income;
  e.textContent = result.expense;
  b.textContent = result.balance;
}

/* MONTHLY + PIE CHART */
let pieChart = null;
let monthPicker = document.getElementById("monthPicker");

if (monthPicker) {
  let today = new Date().toISOString().slice(0, 7);
  monthPicker.value = today;

  loadMonthly(today);

  monthPicker.addEventListener("change", function () {
    loadMonthly(this.value);
  });
}

async function loadMonthly(month) {
  let response = await fetch(API_URL + "/transactions/" + currentUser);
  let data = await response.json();

  let income = 0;
  let expense = 0;

  let categoryTotals = {
    Food: 0,
    Clothing: 0,
    Housing: 0,
    Transport: 0,
    Education: 0,
    Entertainment: 0,
    Other: 0
  };

  data.forEach(item => {
    if (item.date && item.date.startsWith(month)) {
      if (item.type === "income") {
        income += item.amount;
      }

      if (item.type === "expense") {
        expense += item.amount;

        if (categoryTotals[item.category] !== undefined) {
          categoryTotals[item.category] += item.amount;
        } else {
          categoryTotals.Other += item.amount;
        }
      }
    }
  });

  let monthIncome = document.getElementById("monthIncome");
  let monthExpense = document.getElementById("monthExpense");
  let monthBalance = document.getElementById("monthBalance");

  if (monthIncome) monthIncome.textContent = income;
  if (monthExpense) monthExpense.textContent = expense;
  if (monthBalance) monthBalance.textContent = income - expense;

  drawPieChart(categoryTotals);
}

function drawPieChart(categoryTotals) {
  let chartCanvas = document.getElementById("expensePieChart");

  if (!chartCanvas) return;

  let labels = Object.keys(categoryTotals);
  let values = Object.values(categoryTotals);

  if (pieChart) {
    pieChart.destroy();
  }

  pieChart = new Chart(chartCanvas, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: values
      }]
    }
  });
}

/* CATEGORY BUTTON */
function selectCategory(category) {
  let categoryInput = document.getElementById("expenseCategory");
  let selectedText = document.getElementById("selectedCategoryText");

  if (categoryInput) {
    categoryInput.value = category;
  }

  if (selectedText) {
    selectedText.textContent = category;
  }
}

/* RESET */
window.resetAll = function () {
  alert("Reset is disabled because data is stored in MongoDB.");
};

/* LOGOUT */
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

/* USER PAGE */
let welcome = document.getElementById("welcomeText");

if (welcome && currentUser) {
  welcome.textContent = "Welcome, " + currentUser + "!";
}