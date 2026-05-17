async function register() {

  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let response = await fetch(
    "https://expense-tracker-s1c1.onrender.com",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        username,
        password
      })
    }
  );

  let result = await response.json();

  alert(result.message);

}



async function login() {

  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;


  let response = await fetch(
    "https://expense-tracker-s1c1.onrender.com",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        username,
        password
      })
    }
  );


  let result = await response.json();


  if (result.success) {

    localStorage.setItem(
      "currentUser",
      username
    );

    window.location.href = "index.html";

  } else {

    alert(result.message);

  }

}