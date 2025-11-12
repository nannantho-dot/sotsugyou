const API_KEY = "193537ff516ac84ddc1bf049a8936776"; // ← TMDbのAPIキーをここに入れてください
const UPCOMING_URL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=ja-JP&region=JP`;

const movieList = document.getElementById("movie-list");
const searchInput = document.getElementById("search");
let allMovies = [];
let movies = [];

// 🎥 今月・次月分の映画取得（upcoming）
async function fetchUpcoming() {
  allMovies = [];
  for (let page = 1; page <= 2; page++) {
    const res = await fetch(`${UPCOMING_URL}&page=${page}`);
    const data = await res.json();
    if (data.results) allMovies = allMovies.concat(data.results);
  }

  // 詳細APIで homepage を取得
  await Promise.all(allMovies.map(async (movie) => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=ja-JP`);
      const detail = await res.json();
      movie.homepage = detail.homepage; // 公式サイトURL
    } catch {
      movie.homepage = null;
    }
  }));
}

// 🎬 月別フィルタ
function filterByMonth(offset = 0) {
  const today = new Date();
  const target = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const targetMonth = target.getMonth() + 1;
  const targetYear = target.getFullYear();

  movies = allMovies.filter((m) => {
    if (!m.release_date) return false;
    const d = new Date(m.release_date);
    return d.getFullYear() === targetYear && d.getMonth() + 1 === targetMonth;
  });

  movies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
  displayMovies(movies);
}

// 🎬 映画表示
function displayMovies(movieArray) {
  movieList.innerHTML = "";
  if (movieArray.length === 0) {
    movieList.innerHTML = "<p>該当する作品がありません。</p>";
    return;
  }

  movieArray.forEach((movie) => {
    const homepageLink = movie.homepage || "#";
    const div = document.createElement("div");
    div.classList.add("movie-card");
    div.innerHTML = `
      <a href="${homepageLink}" target="_blank">
        <img src="${movie.poster_path ? "https://image.tmdb.org/t/p/w500" + movie.poster_path : "https://via.placeholder.com/500x750?text=No+Image"}" alt="${movie.title}">
      </a>
      <h2>${movie.title}</h2>
      <p>公開日: ${movie.release_date}</p>
    `;
    movieList.appendChild(div);
  });
}

// 🔍 検索
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(query)
  );
  displayMovies(filtered);
});

// 🗓️ ボタン
document.getElementById("this-month").addEventListener("click", () => filterByMonth(0));
document.getElementById("next-month").addEventListener("click", () => filterByMonth(1));

// 初期表示
fetchUpcoming().then(() => filterByMonth(0));
