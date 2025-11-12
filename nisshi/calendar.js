let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

const holidayMap = {
  "2024-01-01": "元日",
  "2024-01-08": "成人の日",
  "2024-02-11": "建国記念の日",
  "2024-02-12": "建国記念の日 振替休日",
  "2024-02-23": "天皇誕生日",
  "2024-03-20": "春分の日",
  "2024-04-29": "昭和の日",
  "2024-05-03": "憲法記念日",
  "2024-05-04": "みどりの日",
  "2024-05-05": "こどもの日",
  "2024-05-06": "こどもの日 振替休日",
  "2024-07-15": "海の日",
  "2024-08-11": "山の日",
  "2024-08-12": "休日 山の日",
  "2024-09-16": "敬老の日",
  "2024-09-22": "秋分の日",
  "2024-09-23": "秋分の日 振替休日",
  "2024-10-14": "スポーツの日",
  "2024-11-03": "文化の日",
  "2024-11-04": "文化の日 振替休日",
  "2024-11-23": "勤労感謝の日",
  "2025-01-01": "元日",
  "2025-01-13": "成人の日",
  "2025-02-11": "建国記念の日",
  "2025-02-23": "天皇誕生日",
  "2025-02-24": "天皇誕生日 振替休日",
  "2025-03-20": "春分の日",
  "2025-04-29": "昭和の日",
  "2025-05-03": "憲法記念日",
  "2025-05-04": "みどりの日",
  "2025-05-05": "こどもの日",
  "2025-05-06": "みどりの日 振替休日",
  "2025-07-21": "海の日",
  "2025-08-11": "山の日",
  "2025-09-15": "敬老の日",
  "2025-09-23": "秋分の日",
  "2025-10-13": "スポーツの日",
  "2025-11-03": "文化の日",
  "2025-11-23": "勤労感謝の日",
  "2025-11-24": "勤労感謝の日 振替休日",
  "2026-01-01": "元日",
  "2026-01-12": "成人の日",
  "2026-02-11": "建国記念の日",
  "2026-02-23": "天皇誕生日",
  "2026-03-20": "春分の日",
  "2026-04-29": "昭和の日",
  "2026-05-03": "憲法記念日",
  "2026-05-04": "みどりの日",
  "2026-05-05": "こどもの日",
  "2026-05-06": "憲法記念日 振替休日",
  "2026-07-20": "海の日",
  "2026-08-11": "山の日",
  "2026-09-21": "敬老の日",
  "2026-09-22": "国民の休日",
  "2026-09-23": "秋分の日",
  "2026-10-12": "スポーツの日",
  "2026-11-03": "文化の日",
  "2026-11-23": "勤労感謝の日"
};

function showCalendar() {
  const calendarTitle = document.getElementById("calendar-title");
  const calendarBody = document.getElementById("calendar-body");

  calendarTitle.textContent = `${currentYear}年 ${["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"][currentMonth]}`;
  calendarBody.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

  const table = document.createElement("table");
  table.className = "calendar-table";
  table.innerHTML = `<tr><th>日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th></tr>`;
  let row = document.createElement("tr");

  for (let i = 0; i < firstDay; i++) row.innerHTML += "<td></td>";

  for (let date = 1; date <= lastDate; date++) {
    const cell = document.createElement("td");
    cell.className = "calendar-day";

    const currentDate = new Date(currentYear, currentMonth, date);
    const dayOfWeek = currentDate.getDay();
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

    if (dayOfWeek === 0) {
      cell.classList.add("sunday");
    } else if (dayOfWeek === 6) {
      cell.classList.add("saturday");
    }

    if (holidayMap[dateStr]) {
      cell.classList.add("holiday");
      cell.title = holidayMap[dateStr]; // ツールチップ表示（任意）
    }

    cell.innerText = date;
    cell.onclick = () => {
      const pad = (n) => n.toString().padStart(2, "0");
      const selectedDate = `${currentYear}/${pad(currentMonth + 1)}/${pad(date)}`;
      localStorage.setItem("selectedDate", selectedDate);
      window.location.href = "edit.html";
    };

    row.appendChild(cell);
    if ((firstDay + date) % 7 === 0 || date === lastDate) {
      table.appendChild(row);
      row = document.createElement("tr");
    }
  }

  calendarBody.appendChild(table);
}

function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  showCalendar();
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

window.onload = () => {
  if (!localStorage.getItem("currentUser")) {
    window.location.href = "login.html";
  }
  showCalendar();
};