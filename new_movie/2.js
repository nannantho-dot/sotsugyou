const TMDB_API_KEY = "193537ff516ac84ddc1bf049a8936776";

const UPCOMING_URL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=ja-JP&region=JP`;

const movieList = document.getElementById("movie-list");
const searchInput = document.getElementById("search");
const cinemaList = document.getElementById("cinema-list");
let allMovies = [];
let movies = [];

// =============================
// TMDb 映画取得
// =============================
async function fetchUpcoming() {
  allMovies = [];
  for (let page = 1; page <= 2; page++) {
    try {
      const res = await fetch(`${UPCOMING_URL}&page=${page}`);
      if (!res.ok) throw new Error(`TMDb API error: ${res.status}`);
      const data = await res.json();
      if (data.results) allMovies = allMovies.concat(data.results);
    } catch (err) {
      console.error(err);
    }
  }

  // 詳細APIで homepage を取得
  await Promise.all(
    allMovies.map(async (movie) => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=ja-JP`
        );
        if (!res.ok) throw new Error(`Detail API error: ${res.status}`);
        const detail = await res.json();
        movie.homepage = detail.homepage;
      } catch {
        movie.homepage = null;
      }
    })
  );
}

// =============================
// 月別フィルタ
// =============================
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

// =============================
// 映画一覧表示
// =============================
function displayMovies(arr) {
  movieList.innerHTML = "";
  if (!arr.length) {
    movieList.innerHTML = "<p>該当する作品がありません。</p>";
    return;
  }

  arr.forEach((movie) => {
    const homepageLink = movie.homepage || "#";
    const div = document.createElement("div");
    div.classList.add("movie-card");
    div.innerHTML = `
      <a href="${homepageLink}" target="_blank">
        <img src="${
          movie.poster_path
            ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
            : "img/no-image.png"
        }" alt="${movie.title}">
      </a>
      <h2>${movie.title}</h2>
      <p>公開日: ${movie.release_date}</p>
    `;
    movieList.appendChild(div);
  });
}

// =============================
// 検索
// =============================
searchInput.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = movies.filter((m) => m.title.toLowerCase().includes(q));
  displayMovies(filtered);
});

// =============================
// ボタン
// =============================
document.getElementById("this-month").addEventListener("click", () => filterByMonth(0));
document.getElementById("next-month").addEventListener("click", () => filterByMonth(1));
document.getElementById("find-cinemas").addEventListener("click", findCinemas);

// =============================
// Google Maps 近くの映画館
// =============================
function findCinemas() {
  cinemaList.innerHTML = "近くの映画館を検索中…";

  if (!navigator.geolocation) {
    cinemaList.innerHTML = "位置情報を取得できませんでした。";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      if (!window.google || !google.maps) {
        cinemaList.innerHTML = "Google Maps API が読み込まれていません。";
        return;
      }

      const service = new google.maps.places.PlacesService(document.createElement("div"));
      service.nearbySearch(
        {
          location: new google.maps.LatLng(lat, lng),
          radius: 5000,
          type: ["movie_theater"],
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            displayCinemas(results);
          } else {
            cinemaList.innerHTML = "近くの映画館が見つかりませんでした。";
            console.error("Places API status:", status);
          }
        }
      );
    },
    (err) => {
      cinemaList.innerHTML = "位置情報を取得できませんでした。";
      console.error(err);
    }
  );
}

function displayCinemas(results) {
  cinemaList.innerHTML = "";
  results.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("cinema-card");
    div.innerHTML = `<h3>${p.name}</h3><p>${p.vicinity || "住所不明"}</p>`;
    cinemaList.appendChild(div);
  });
}

// =============================
// 初期表示
// =============================
fetchUpcoming().then(() => filterByMonth(0));
