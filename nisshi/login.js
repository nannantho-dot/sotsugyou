function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (users[email]) {
    document.getElementById("loginStatus").innerText = "すでに登録されています";
    return;
  }

  users[email] = { password };
  localStorage.setItem("users", JSON.stringify(users));
  document.getElementById("loginStatus").innerText = "登録成功！";
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (users[email] && users[email].password === password) {
    localStorage.setItem("currentUser", email);
    window.location.href = "calendar.html";
  } else {
    document.getElementById("loginStatus").innerText = "ログイン失敗";
  }
}