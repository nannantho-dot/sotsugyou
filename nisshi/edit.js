async function fetchWeather() {
  const apiKey = "922b87a0fe71c25d894dc1f3ba2f9f21";
  const city = "Osaka";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ja`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const description = data.weather[0].description;
    const temp = data.main.temp;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    return { text: `${description}（${temp}℃）`, iconUrl };
  } catch (error) {
    console.error("天気取得エラー:", error);
    return { text: "天気情報取得失敗", iconUrl: null };
  }
}

async function saveDiary() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const emoji = document.getElementById("emojiSelector").value;
  const date = localStorage.getItem("selectedDate");
  const email = localStorage.getItem("currentUser");

  if (!email || !date) {
    document.getElementById("status").innerText = "ログイン情報または日付が見つかりません";
    return;
  }

  const weather = await fetchWeather();

  const diary = { title, content, date, weather, emoji };
  const allDiaries = JSON.parse(localStorage.getItem("diaries") || "{}");
  const userDiaries = allDiaries[email] || [];

  const existingIndex = userDiaries.findIndex(entry => entry.date === date);
  if (existingIndex !== -1) {
    userDiaries.splice(existingIndex, 1);
  }
  userDiaries.push(diary);
  allDiaries[email] = userDiaries;
  localStorage.setItem("diaries", JSON.stringify(allDiaries));

  const weatherDisplay = document.getElementById("weatherDisplay");
  weatherDisplay.innerText = `天気：${weather.text}`;
  if (weather.iconUrl) {
    const img = document.createElement("img");
    img.src = weather.iconUrl;
    img.alt = "天気アイコン";
    img.style.width = "40px";
    img.style.height = "40px";
    img.style.verticalAlign = "middle";
    img.style.marginLeft = "8px";
    weatherDisplay.appendChild(img);
  }

  document.getElementById("status").innerText = `保存しました！`;
  setTimeout(() => location.reload(), 500);
}

function goBack() {
  window.location.href = "calendar.html";
}

function moveDate(offset) {
  const current = localStorage.getItem("selectedDate");
  const [year, month, day] = current.split("/").map(Number);

  const dateObj = new Date(year, month - 1, day);
  dateObj.setDate(dateObj.getDate() + offset);

  const pad = (n) => n.toString().padStart(2, "0");
  const newDate = `${dateObj.getFullYear()}/${pad(dateObj.getMonth() + 1)}/${pad(dateObj.getDate())}`;

  localStorage.setItem("selectedDate", newDate);
  location.reload();
}

window.onload = async () => {
  const date = localStorage.getItem("selectedDate");
  const email = localStorage.getItem("currentUser");
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const emojiSelector = document.getElementById("emojiSelector");
  const weatherDisplay = document.getElementById("weatherDisplay");

  document.getElementById("dateHeading").innerText = `${date} の日記`;

  const allDiaries = JSON.parse(localStorage.getItem("diaries") || "{}");
  const userDiaries = allDiaries[email] || [];

  const existing = userDiaries.find(diary => diary.date === date);

  if (existing) {
    titleInput.value = existing.title;
    contentInput.value = existing.content;
    if (existing.emoji) {
      emojiSelector.value = existing.emoji;
    }

    if (typeof existing.weather === "object" && existing.weather !== null) {
      weatherDisplay.innerText = `天気：${existing.weather.text}`;
      if (existing.weather.iconUrl) {
        const img = document.createElement("img");
        img.src = existing.weather.iconUrl;
        img.alt = "天気アイコン";
        img.style.width = "40px";
        img.style.height = "40px";
        img.style.verticalAlign = "middle";
        img.style.marginLeft = "8px";
        weatherDisplay.appendChild(img);
      }
    } else {
      weatherDisplay.innerText = `天気：${existing.weather || "不明"}`;
    }

    document.getElementById("status").innerText = `既存の日記を表示しています`;
  } else {
    titleInput.value = `${date}の日記`;
    contentInput.value = "";
    emojiSelector.value = "";
    const weather = await fetchWeather();
    weatherDisplay.innerText = `天気：${weather.text}`;
    if (weather.iconUrl) {
      const img = document.createElement("img");
      img.src = weather.iconUrl;
      img.alt = "天気アイコン";
      img.style.width = "50px";
      img.style.height = "50px";
      img.style.verticalAlign = "middle";
      img.style.marginLeft = "8px";
      weatherDisplay.appendChild(img);
    }
    document.getElementById("status").innerText = "新しい日記を作成中";
  }
};

const contentInput = document.getElementById("content");
const charCount = document.getElementById("charCount");

contentInput.addEventListener("input", () => {
  const length = contentInput.value.length;
  charCount.innerText = `${length} / 200 文字`;

  if (length > 200) {
    contentInput.value = contentInput.value.slice(0, 200);
    charCount.innerText = `200 / 200 文字（制限）`;
  }
});


function deleteDiary() {
  const modal = document.getElementById("confirmModal");
  modal.style.display = "block";

  document.getElementById("confirmYes").onclick = () => {
    modal.style.display = "none";

    const date = localStorage.getItem("selectedDate");
    const email = localStorage.getItem("currentUser");

    if (!email || !date) {
      document.getElementById("status").innerText = "ログイン情報または日付が見つかりません";
      return;
    }

    const allDiaries = JSON.parse(localStorage.getItem("diaries") || "{}");
    const userDiaries = allDiaries[email] || [];

    const updatedDiaries = userDiaries.filter(entry => entry.date !== date);
    allDiaries[email] = updatedDiaries;
    localStorage.setItem("diaries", JSON.stringify(allDiaries));

    document.getElementById("status").innerText = "日記を削除しました";
    document.getElementById("title").value = `${date}の日記`;
    document.getElementById("content").value = "";
    document.getElementById("emojiSelector").value = "";
  };

  document.getElementById("confirmNo").onclick = () => {
    modal.style.display = "none";
    document.getElementById("status").innerText = "削除をキャンセルしました";
  };
}