import { films, plans } from "./catalog.js";

const icons = {
  home: '<path d="m3 11 9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
  grid: '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2"/><rect x="14" y="14" width="6.5" height="6.5" rx="1.2"/>',
  ticket: '<path d="M4 5.5h16a1 1 0 0 1 1 1v3a2.5 2.5 0 1 0 0 5v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a2.5 2.5 0 1 0 0-5v-3a1 1 0 0 1 1-1Z"/><path d="M14 6v2m0 3v2m0 3v2"/>',
  save: '<path d="M6 5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V21l-6-3.8L6 21Z"/>',
  saved: '<path fill="currentColor" d="M6 5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V21l-6-3.8L6 21Z"/>',
  search: '<circle cx="10.7" cy="10.7" r="5.7"/><path d="m15 15 4.7 4.7"/>',
  play: '<path d="M8 5.5 19 12 8 18.5Z" fill="currentColor" stroke-linejoin="round"/>',
  info: '<circle cx="12" cy="12" r="8.4"/><path d="M12 11.7v4.3M12 8.1h.01"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  lock: '<rect x="5.5" y="10.5" width="13" height="10" rx="2"/><path d="M8 10.5V7.3a4 4 0 1 1 8 0v3.2M12 15v2"/>',
  download: '<path d="M12 4v12m-4-4 4 4 4-4M5 19v1.5h14V19"/>',
  done: '<path d="m5 12 4 4L19 6"/>'
};

const navigation = [
  { id: "home", label: "Нүүр", icon: "home" },
  { id: "catalog", label: "Кино сан", icon: "grid" },
  { id: "plans", label: "Багц", icon: "ticket" },
  { id: "list", label: "Миний жагсаалт", shortLabel: "Жагсаалт", icon: "save" }
];
const genres = ["Бүгд", ...new Set(films.map(film => film.genre))];
const editorial = films.slice(0, 3);
const rentalFilms = films.filter(film => film.episodes.some(episode => episode.locked));
const expiryDate = new Intl.DateTimeFormat("mn-MN", { dateStyle: "medium", timeStyle: "short" });
const storageKey = "ornol-viewer-v1";
const main = document.querySelector("#main-content");
const filmDialog = document.querySelector("#film-dialog");
const searchDialog = document.querySelector("#search-dialog");
const searchTrigger = document.querySelector("#open-search");
const notice = document.querySelector("#notice");

let page;
let selectedFeature = 0;
let selectedGenre = genres[0];
let filmOpener;
let noticeTimer;
let recordActivePlayer;
let viewerChanged = false;
let checkout;

function readState() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey)) ?? {};
    return {
      saved: Array.isArray(data.saved) ? data.saved : [],
      access: Array.isArray(data.access) ? data.access : [],
      passes: data.passes && typeof data.passes === "object" && !Array.isArray(data.passes) ? data.passes : {},
      progress: data.progress && typeof data.progress === "object" ? data.progress : {}
    };
  } catch {
    return { saved: [], access: [], passes: {}, progress: {} };
  }
}

const viewer = readState();

function writeState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(viewer));
  } catch {
    // Keep the current session usable when the browser restricts local storage.
  }
}

function icon(name, size = 20) {
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
}

function clock(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function filmPath(film) {
  return `#film/${film.id}`;
}

function watchPath(film, index) {
  return `#watch/${film.id}/${index + 1}`;
}

function checkoutPath(plan, film, index) {
  return `#checkout/${plan.id}${film ? `/${film.id}` : ""}${index === undefined ? "" : `/${index + 1}`}`;
}

function priceTag(price) {
  return `${price.toLocaleString("en-US")}₮`;
}

function progressFor(film, index) {
  return viewer.progress[`${film.id}/${index + 1}`];
}

function resumeFor(film) {
  return film.episodes
    .map((episode, index) => ({ episode, index, progress: progressFor(film, index) }))
    .filter(({ episode, progress }) => progress && !progress.done && progress.time > 0 && !isLocked(film, episode))
    .sort((a, b) => b.progress.updated - a.progress.updated)[0];
}

function newNotice(message) {
  clearTimeout(noticeTimer);
  notice.textContent = message;
  notice.classList.add("is-visible");
  noticeTimer = setTimeout(() => {
    notice.classList.remove("is-visible");
    notice.textContent = "";
  }, 2450);
}

function renderNavigation() {
  for (const [selector, mobile] of [["#top-nav", false], ["#mobile-nav", true]]) {
    document.querySelector(selector).innerHTML = navigation.map(item => `
      <a href="#${item.id}" ${item.id === page ? 'aria-current="page"' : ""} aria-label="${item.label}">
        ${mobile ? icon(item.icon) : ""}<span>${mobile ? item.shortLabel ?? item.label : item.label}</span>
      </a>`).join("");
  }
}

function saveButton(film, large = false) {
  const saved = viewer.saved.includes(film.id);
  const label = saved ? "Жагсаалтаас хасах" : "Жагсаалтад нэмэх";
  const className = large ? "button button-secondary" : "icon-button card-save";
  return `<button type="button" class="${className}" data-save="${film.id}" aria-pressed="${saved}"
    aria-label="${film.title}, ${label}" title="${label}">
    ${icon(saved ? "saved" : "save", 18)}${large ? `<span>${label}</span>` : ""}
  </button>`;
}

function card(film, resume) {
  const ep = resume?.episode ?? film.episodes[0];
  const target = resume ? watchPath(film, resume.index) : filmPath(film);
  const percent = resume ? Math.max(3, Math.min(100, 100 * resume.progress.time / resume.progress.duration)) : 0;
  return `<article class="card">
    <a class="card-link" href="${target}">
      <span class="card-cover">
        <img src="${film.cover}" alt="" width="480" height="300" loading="lazy" decoding="async">
        <span class="card-length">${clock(ep.seconds)}</span>
        ${resume ? `<span class="resume-bar" aria-hidden="true"><span style="width:${percent}%"></span></span>` : ""}
      </span>
      <span class="card-info">
        <span class="card-title">${film.title}</span>
        <span class="card-genre">${resume ? "Үргэлжлүүлэх" : film.genre + (isLocked(film, ep) ? " · Түрээс" : "")}</span>
      </span>
    </a>
    ${saveButton(film)}
  </article>`;
}

function feature(film) {
  const resume = resumeFor(film);
  return `<section class="feature" aria-labelledby="feature-title" style="--focal:${film.focal};--mobile-focal:${film.mobileFocal}">
    <img class="feature-art" src="${film.hero}" alt="" fetchpriority="high">
    <div class="frame feature-inner">
      <p class="eyebrow">Онцлох бүтээл</p>
      <h1 class="feature-title" id="feature-title">${film.titleLines.map(line => `<span>${line}</span>`).join(" ")}</h1>
      <p class="feature-meta"><span>AI кино</span><span>${film.genre}</span>
        <span>${film.episodes.length > 1 ? `${film.episodes.length} хэсэг` : clock(film.episodes[0].seconds)}</span>
      </p>
      <p class="feature-copy">${film.summary}</p>
      <div class="actions">
        <a class="button button-primary" href="${watchPath(film, resume?.index ?? 0)}">${icon(isLocked(film, film.episodes[0]) ? "lock" : "play")} ${playLabel(film, resume)}</a>
        <a class="button button-secondary" href="${filmPath(film)}">${icon("info")} Дэлгэрэнгүй</a>
      </div>
    </div>
    <div class="frame feature-controls">
      <div class="feature-choices" role="group" aria-label="Онцлох бүтээл солих">
        ${editorial.map((choice, index) => `<button class="feature-choice" type="button" data-feature="${index}"
          aria-pressed="${index === selectedFeature}" aria-label="${choice.title}" title="${choice.title}"><span></span></button>`).join("")}
      </div>
    </div>
  </section>`;
}

function resumeShelf() {
  const entries = films
    .map(film => ({ film, resume: resumeFor(film) }))
    .filter(entry => entry.resume)
    .sort((a, b) => b.resume.progress.updated - a.resume.progress.updated);
  if (entries.length === 0) return "";
  return `<section class="shelf" aria-labelledby="continue-heading">
    <div class="section-head"><h2 id="continue-heading">Үргэлжлүүлэн үзэх</h2></div>
    <div class="card-grid">${entries.map(({ film, resume }) => card(film, resume)).join("")}</div>
  </section>`;
}

function homePage() {
  const highlights = films.filter(film => film.id !== "sarnii-tsaana");
  return `${feature(editorial[selectedFeature])}
    <div class="frame shelves">
      ${resumeShelf()}
      <section class="shelf" aria-labelledby="shelf-title">
        <div class="section-head"><h2 id="shelf-title">Кино сан</h2><a class="text-link" href="#catalog">Бүгдийг үзэх</a></div>
        <div class="card-grid">${highlights.map(film => card(film)).join("")}</div>
      </section>
      <section class="shelf" aria-labelledby="home-plans-title">
        <div class="section-head"><h2 id="home-plans-title">Үзэх багц</h2><a class="text-link" href="#plans">Бүх багц</a></div>
        ${planGrid([plans[0], plans[2], plans[3]], "plan-grid-compact")}
      </section>
    </div>`;
}

function catalogPage() {
  return `<div class="frame page-content">
    <h1 class="page-title" tabindex="-1">Кино сан</h1>
    <div class="catalog-tools">
      <div class="filters" role="group" aria-label="Жанраар шүүх">
        ${genres.map(genre => `<button class="filter" type="button" aria-pressed="${selectedGenre === genre}" data-genre="${genre}">${genre}</button>`).join("")}
      </div>
      <p id="results-count" class="results-count" aria-live="polite"></p>
    </div>
    <div id="catalog-grid" class="card-grid"></div>
  </div>`;
}

function renderCatalogResults() {
  const items = selectedGenre === genres[0] ? films : films.filter(film => film.genre === selectedGenre);
  document.querySelector("#results-count").textContent = `${items.length} бүтээл`;
  document.querySelector("#catalog-grid").innerHTML = items.map(film => card(film)).join("");
  main.querySelectorAll("[data-genre]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.genre === selectedGenre));
  });
}

function listPage() {
  const saved = viewer.saved.map(id => films.find(film => film.id === id)).filter(Boolean);
  return `<div class="frame page-content">
    <h1 class="page-title" tabindex="-1">Миний жагсаалт</h1>
    <p class="page-description">Энэ хөтөч дээр хадгалсан бүтээл, үзсэн хэсгээ үргэлжлүүлээрэй.</p>
    ${resumeShelf()}
    <section class="shelf collection-shelf" aria-labelledby="saved-heading">
      <div class="section-head"><h2 id="saved-heading">Хадгалсан бүтээл</h2></div>
      ${saved.length ? `<div class="card-grid">${saved.map(film => card(film)).join("")}</div>` : `
        <div class="empty-state">
          <h2>Жагсаалт хоосон байна</h2>
          <p>Дуртай бүтээлээ хавчуурганы товчоор хадгалаарай.</p>
          <a class="button button-primary" href="#catalog">Кино сан үзэх</a>
        </div>`}
    </section>
  </div>`;
}

function planCard(plan, film, index) {
  return `<a class="plan-card" href="${checkoutPath(plan, film, index)}">
    <span class="plan-label">${plan.label}</span>
    <strong class="plan-duration">${plan.duration}</strong>
    <span class="plan-price">${priceTag(plan.price)}</span>
  </a>`;
}

function planGrid(items, className = "") {
  return `<div class="plan-grid ${className}">${items.map(plan => planCard(plan)).join("")}</div>`;
}

function plansPage() {
  const active = [{ id: "catalog", title: "Бүх кино" }, ...rentalFilms]
    .filter(item => Number.isFinite(viewer.passes[item.id]) && viewer.passes[item.id] > Date.now());
  return `<div class="frame page-content">
    <h1 class="page-title" tabindex="-1">Үзэх багц</h1>
    <p class="page-description">Нэг киног түрээслэх эсвэл бүх киног хугацаатай үзэх эрх сонгоорой. Туршилтын төлбөр 0₮.</p>
    ${planGrid(plans)}
    ${active.length ? `<section class="active-passes" aria-labelledby="active-pass-title">
      <h2 id="active-pass-title">Идэвхтэй эрх</h2>
      <ul>${active.map(item => `<li><strong>${item.title}</strong><span>${expiryDate.format(viewer.passes[item.id])} хүртэл</span></li>`).join("")}</ul>
    </section>` : ""}
  </div>`;
}

function creditsPage() {
  return `<div class="frame page-content">
    <h1 class="page-title" tabindex="-1">Бичлэгийн эх сурвалж</h1>
    <p class="page-description">Эдгээр нь OpenAI Sora-аар үүсгэсэн жишээ бичлэгүүд юм. Өрнөл туршилтын каталогт зориулж нэр, тайлбар, зураг нэмж, бичлэгийг MP4 форматаар бэлтгэсэн.</p>
    <ul class="credits-list">
      ${films.map(film => `<li class="credit-row">
        <div><strong>${film.title}</strong><p>${film.sourceTitle} · OpenAI Sora</p></div>
        <a class="text-link" href="${film.source}" target="_blank" rel="noopener noreferrer">Эх бичлэг</a>
      </li>`).join("")}
    </ul>
  </div>`;
}

const pages = { home: homePage, catalog: catalogPage, plans: plansPage, list: listPage, credits: creditsPage };

function renderPage() {
  main.innerHTML = pages[page]();
  if (page === "catalog") renderCatalogResults();
  viewerChanged = false;
}

function closeButton(name, className = "") {
  return `<button class="icon-button ${className}" type="button" data-close="${name}" aria-label="Хаах" title="Хаах">${icon("close")}</button>`;
}

function dialogTop(title, description = "") {
  return `<div class="dialog-top">
    <div><h2 id="dialog-title">${title}</h2>${description ? `<span class="player-episode">${description}</span>` : ""}</div>
    ${closeButton("film")}
  </div>`;
}

function isLocked(film, episode) {
  if (!episode.locked || viewer.access.includes(film.id)) return false;
  const now = Date.now();
  return !(viewer.passes.catalog > now || viewer.passes[film.id] > now);
}

function playLabel(film, resume) {
  const first = film.episodes[0];
  if (resume) return "Үргэлжлүүлэх";
  if (isLocked(film, first)) return "Эрх авах";
  return first.locked ? "Үзэх" : "Үнэгүй үзэх";
}

function episodeList(film) {
  return film.episodes.map((episode, index) => {
    const locked = isLocked(film, episode);
    const watched = progressFor(film, index)?.done;
    const status = locked ? "Эрх шаардлагатай" : watched ? "Үзсэн" : episode.locked ? "Эрхтэй" : "Үнэгүй";
    const mark = locked ? "lock" : watched ? "done" : "play";
    return `<li><a class="episode" href="${watchPath(film, index)}">
      <img class="episode-thumb" src="${film.cover}" alt="">
      <span class="episode-text">
        <span class="episode-title">${film.episodes.length > 1 ? `${index + 1}. ` : ""}${episode.title}</span>
        <span class="episode-meta">${clock(episode.seconds)} · ${status}</span>
      </span>
      ${icon(mark, 18)}
    </a></li>`;
  }).join("");
}

function detailMarkup(film) {
  const resume = resumeFor(film);
  const target = watchPath(film, resume?.index ?? 0);
  const first = film.episodes[0];
  const locked = isLocked(film, first);
  return `<div class="detail-hero" style="--focal:${film.focal ?? "50% 50%"}">
    <img src="${film.hero ?? film.cover}" alt="">
    ${closeButton("film", "dialog-close-art")}
    <div class="detail-intro">
      <p class="eyebrow">Жишээ кино</p>
      <h2 class="detail-title" id="dialog-title">${film.title}</h2>
      <p class="detail-meta"><span>${film.genre}</span><span>${film.episodes.length} хэсэг</span></p>
    </div>
  </div>
  <div class="detail-body">
    <p class="detail-copy">${film.summary}</p>
    <div class="actions">
      <a class="button button-primary" href="${target}">${icon(locked ? "lock" : "play")} ${playLabel(film, resume)}</a>
      ${saveButton(film, true)}
    </div>
    <h3>Хэсгүүд</h3>
    <ol class="episode-list">${episodeList(film)}</ol>
    <div class="detail-footer">
      ${locked ? "" : `<a href="${first.file}" download>${icon("download", 17)} MP4 татах</a>`}
      <a href="${film.source}" target="_blank" rel="noopener noreferrer">Эх сурвалж</a>
    </div>
  </div>`;
}

function playerMarkup(film, index) {
  const episode = film.episodes[index];
  const following = film.episodes[index + 1];
  const part = film.episodes.length > 1 ? `${index + 1}-р хэсэг · ` : "";
  return `${dialogTop(film.title, part + episode.title)}
    <div class="player-frame">
      <video id="video-player" src="${episode.file}" controls playsinline preload="metadata"
        poster="${film.cover}" aria-label="${film.title} · ${episode.title}">
        ${episode.captions ? `<track kind="captions" srclang="mn" label="Монгол тайлбар" src="${episode.captions}">` : ""}
        <p>Энэ хөтөч бичлэг тоглуулах боломжгүй. <a href="${episode.file}" download>MP4 татах</a></p>
      </video>
    </div>
    <p id="player-message" class="player-error" role="status" hidden>Бичлэг ачаалагдсангүй. <a href="${episode.file}" download>MP4 файлаар татах</a></p>
    <div class="player-tools">
      <a class="button button-secondary" href="${filmPath(film)}">${icon("info", 18)} Киноны мэдээлэл</a>
      ${following ? `<a class="button button-primary" href="${watchPath(film, index + 1)}">
        ${icon(isLocked(film, following) ? "lock" : "play", 18)} Дараагийн хэсэг
      </a>` : ""}
    </div>`;
}

function accessMarkup(film, index) {
  return `${dialogTop(film.title, "Үзэх эрх сонгох")}
    <div class="access-content">
      <p>Зөвхөн энэ кино эсвэл бүх киног үзэх эрхээ сонгоорой. Туршилтын төлбөр 0₮.</p>
      <div class="checkout-options">${plans.slice(0, 2).map(plan => planCard(plan, film, index)).join("")}</div>
      <details class="extra-plans">
        <summary>Бусад багц</summary>
        <div class="checkout-options">${plans.slice(2).map(plan => planCard(plan, film, index)).join("")}</div>
      </details>
    </div>`;
}

function showCheckoutPhone() {
  const { plan, film } = checkout;
  showDialog(`${dialogTop("Утасны дугаар", "Багц баталгаажуулах")}
    <div class="access-content">
      <div class="access-summary"><span>${plan.label} · ${plan.duration}</span><strong>${priceTag(plan.price)}</strong></div>
      <form id="checkout-form" class="checkout-form">
        ${plan.single ? `<label for="checkout-film">Кино сонгох</label>
          <select id="checkout-film" required>
            <option value="">Кино сонгох</option>
            ${rentalFilms.map(item => `<option value="${item.id}" ${item === film ? "selected" : ""}>${item.title}</option>`).join("")}
          </select>` : ""}
        <label for="checkout-phone">Демо утасны дугаар</label>
        <div class="checkout-phone">
          <span aria-hidden="true">+976</span>
          <input id="checkout-phone" type="tel" inputmode="numeric" autocomplete="off" maxlength="8"
            pattern="[0-9]{8}" placeholder="8 оронтой дугаар" aria-describedby="checkout-help" required>
        </div>
        <p id="checkout-help">Жишээ дугаар ашиглаарай. Дугаар энэ алхамд л хэрэглэгдэнэ.</p>
        <div class="actions">
          <button type="button" class="button button-secondary" data-test-number>Жишээ дугаар</button>
          <button type="submit" class="button button-primary">Үргэлжлүүлэх</button>
        </div>
      </form>
    </div>`);
}

function showCheckoutPayment() {
  const { plan, film } = checkout;
  const title = plan.single ? film.title : plan.label;
  showDialog(`${dialogTop("QPay демо", "Төлбөр баталгаажуулах")}
    <div class="access-content">
      <p>Демо төлбөрийг баталгаажуулснаар энэ хөтөч дээр үзэх эрх нээгдэнэ.</p>
      <div class="access-summary"><span>${title} · ${plan.duration}</span><strong>0₮</strong></div>
      <div class="actions">
        <button class="button button-secondary" type="button" data-checkout-edit>Буцах</button>
        <button class="button button-primary" type="button" data-checkout-confirm>${icon("done", 18)} Демо төлбөр батлах</button>
      </div>
    </div>`);
}

function completeCheckout() {
  const { plan, film, index } = checkout;
  const accessKey = plan.single ? film.id : "catalog";
  const expires = Date.now() + plan.days * 86400000;
  viewer.passes[accessKey] = Math.max(viewer.passes[accessKey] || 0, expires);
  writeState();
  viewerChanged = true;
  const firstLocked = film?.episodes.findIndex(episode => episode.locked) ?? 0;
  const target = film ? watchPath(film, index ?? Math.max(firstLocked, 0)) : "#catalog";
  history.replaceState(null, "", target);
  syncRoute(true);
  if (!film) newNotice("Үзэх эрх нээгдлээ");
}

function mountVideo(film, index) {
  const video = filmDialog.querySelector("#video-player");
  const errorMessage = filmDialog.querySelector("#player-message");
  const key = `${film.id}/${index + 1}`;
  const previous = viewer.progress[key];
  let lastTime;
  let lastDone;

  function savePosition(force = false) {
    const { currentTime: time, duration } = video;
    if (!Number.isFinite(duration) || time < .45) return;
    const done = video.ended || time >= duration - .2;
    if (lastDone === done && (lastTime === time || (!force && Math.abs(lastTime - time) < .75))) return;
    viewer.progress[key] = { time, duration, done, updated: Date.now() };
    lastTime = time;
    lastDone = done;
    viewerChanged = true;
    writeState();
  }

  video.addEventListener("loadedmetadata", () => {
    if (previous && !previous.done && previous.time < video.duration - .25) video.currentTime = previous.time;
  }, { once: true });
  video.addEventListener("timeupdate", () => savePosition());
  video.addEventListener("pause", () => savePosition(true));
  video.addEventListener("ended", () => savePosition(true));
  video.addEventListener("error", () => {
    errorMessage.hidden = false;
  });
  recordActivePlayer = () => {
    savePosition(true);
    video.pause();
  };
  video.play().catch(() => {
    // Native controls remain available when the browser requires another tap.
  });
}

function stopVideo() {
  if (recordActivePlayer) recordActivePlayer();
  recordActivePlayer = undefined;
}

function showFilm(film, index) {
  stopVideo();
  checkout = undefined;
  const episode = film.episodes[index];
  const playable = episode && !isLocked(film, episode);
  showDialog(playable ? playerMarkup(film, index) : episode ? accessMarkup(film, index) : detailMarkup(film), Boolean(playable));
  if (playable) mountVideo(film, index);
}

function showDialog(markup, playable = false) {
  filmDialog.classList.toggle("dialog-player", Boolean(playable));
  filmDialog.innerHTML = markup;
  filmDialog.scrollTop = 0;
  if (!filmDialog.open) filmDialog.showModal();
  filmDialog.querySelector("[data-close]").focus({ preventScroll: true });
}

function changePage(next) {
  const changed = next !== page;
  page = next;
  if (changed) renderNavigation();
  if (changed || viewerChanged) renderPage();
  return changed;
}

function syncRoute(focusPage = false) {
  const [route, id, target, part] = location.hash.slice(1).split("/");
  const plan = route === "checkout" ? plans.find(item => item.id === id) : undefined;
  if (plan) {
    if (!page) changePage("plans");
    if (searchDialog.open) searchDialog.close();
    stopVideo();
    const film = rentalFilms.find(item => item.id === target);
    const index = Number(part) - 1;
    checkout = { plan, film, index: Number.isInteger(index) && film?.episodes[index] ? index : undefined };
    showCheckoutPhone();
    document.title = "Үзэх эрх авах · Өрнөл";
    return;
  }
  const film = ["film", "watch"].includes(route) ? films.find(item => item.id === id) : undefined;
  if (film) {
    if (!page) changePage("home");
    if (searchDialog.open) searchDialog.close();
    const index = Number(target) - 1;
    showFilm(film, route === "watch" && Number.isInteger(index) && index >= 0 ? index : undefined);
    document.title = `${film.title} · Өрнөл`;
    return;
  }

  const wasFilmOpen = filmDialog.open;
  if (wasFilmOpen) {
    stopVideo();
    checkout = undefined;
    filmDialog.close();
    filmDialog.replaceChildren();
  }
  const validPage = Object.hasOwn(pages, route) ? route : "home";
  const changed = changePage(validPage);
  const section = navigation.find(item => item.id === page)?.label ?? "Бичлэгийн эх сурвалж";
  document.title = page === "home" ? "Өрнөл · AI кино" : `${section} · Өрнөл`;
  if (changed) window.scrollTo(0, 0);
  if (wasFilmOpen && !changed) {
    const previousHref = filmOpener?.getAttribute("href");
    const matchingLink = previousHref && [...main.querySelectorAll("a")].find(link => link.getAttribute("href") === previousHref);
    (filmOpener?.isConnected ? filmOpener : matchingLink || main).focus({ preventScroll: true });
  } else if (changed && focusPage) {
    const title = main.querySelector(".page-title") ?? main;
    title.focus({ preventScroll: true });
  }
  filmOpener = undefined;
}

function dismissFilm() {
  history.replaceState(null, "", `#${page}`);
  syncRoute();
}

function toggleSaved(id) {
  const film = films.find(item => item.id === id);
  if (!film) return;
  const saved = viewer.saved.includes(id);
  viewer.saved = saved ? viewer.saved.filter(item => item !== id) : [...viewer.saved, id];
  writeState();
  newNotice(saved ? "Жагсаалтаас хаслаа" : "Жагсаалтад хадгаллаа");

  if (page === "list") {
    renderPage();
    if (!filmDialog.open) main.querySelector("h1").focus({ preventScroll: true });
  }
  for (const button of document.querySelectorAll(`[data-save="${id}"]`)) {
    const updated = document.createRange().createContextualFragment(saveButton(film, !button.classList.contains("card-save"))).firstElementChild;
    const hadFocus = button === document.activeElement;
    button.replaceWith(updated);
    if (hadFocus) updated.focus({ preventScroll: true });
  }
}

function searchMatches(query) {
  const words = query.toLowerCase().normalize("NFC").trim().split(/\s+/);
  return films.filter(film => {
    const searchable = `${film.title} ${film.genre} ${film.id.replaceAll("-", " ")} ${film.sourceTitle}`
      .toLowerCase().normalize("NFC");
    return words.every(word => searchable.includes(word));
  });
}

function renderSearch(query) {
  const results = searchMatches(query);
  searchDialog.querySelector("#search-results").innerHTML = results.length
    ? results.map(film => `<a class="search-result" href="${filmPath(film)}">
        <img src="${film.cover}" alt="" width="72" height="45">
        <span><strong>${film.title}</strong><small>${film.genre} · ${clock(film.episodes[0].seconds)}</small></span>
      </a>`).join("")
    : '<p class="search-empty">Бүтээл олдсонгүй. Өөр нэр эсвэл жанраар хайгаарай.</p>';
}

function showSearch() {
  if (filmDialog.open) return;
  if (!searchDialog.open) searchDialog.showModal();
  searchDialog.querySelector("input").focus();
}

searchDialog.innerHTML = `<div class="dialog-top">
  <h2 id="search-title">Кино хайх</h2>${closeButton("search")}
</div>
<div class="search-body">
  <label class="search-field">${icon("search")}<input type="search" aria-label="Бүтээлийн нэр эсвэл жанр"
    placeholder="Бүтээлийн нэр эсвэл жанр" autocomplete="off" spellcheck="false"></label>
  <div id="search-results" class="search-results" aria-live="polite"></div>
</div>`;
searchDialog.querySelector("input").addEventListener("input", event => renderSearch(event.target.value));
renderSearch("");

searchTrigger.addEventListener("click", showSearch);
document.querySelector('[data-icon="search"]').innerHTML = icon("search", 19);
document.querySelector(".skip-link").addEventListener("click", event => {
  event.preventDefault();
  main.focus();
});

document.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (button?.dataset.close === "film") dismissFilm();
  if (button?.dataset.close === "search") searchDialog.close();
  if (button?.dataset.save) toggleSaved(button.dataset.save);
  if (button?.dataset.genre) {
    selectedGenre = button.dataset.genre;
    renderCatalogResults();
  }
  if (button?.dataset.feature !== undefined) {
    selectedFeature = Number(button.dataset.feature);
    main.querySelector(".feature").outerHTML = feature(editorial[selectedFeature]);
    main.querySelector('[data-feature][aria-pressed="true"]').focus({ preventScroll: true });
  }
  if (button?.hasAttribute("data-test-number")) {
    const phone = filmDialog.querySelector("#checkout-phone");
    phone.value = "00000000";
    phone.focus();
  }
  if (button?.hasAttribute("data-checkout-edit")) showCheckoutPhone();
  if (button?.hasAttribute("data-checkout-confirm")) completeCheckout();

  const link = event.target.closest("a[href^='#']");
  if (link && /^#(?:watch|film|checkout)\//.test(link.hash) && !filmDialog.open) {
    filmOpener = searchDialog.contains(link) ? searchTrigger : link;
  }
});

filmDialog.addEventListener("submit", event => {
  if (event.target.id !== "checkout-form") return;
  event.preventDefault();
  if (checkout.plan.single) {
    const selected = rentalFilms.find(item => item.id === event.target.querySelector("select").value);
    if (!selected) return;
    if (checkout.film !== selected) checkout.index = undefined;
    checkout.film = selected;
  }
  showCheckoutPayment();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && searchDialog.open) {
    event.preventDefault();
    searchDialog.close();
    return;
  }
  const inField = event.target.closest("input, textarea, [contenteditable]");
  const searchShortcut = event.key === "/" && !inField && !event.ctrlKey && !event.metaKey;
  const commandShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
  if ((searchShortcut || commandShortcut) && !filmDialog.open) {
    event.preventDefault();
    showSearch();
  }
});

function closeOnBackdrop(dialog, close) {
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      close();
    }
  });
}

filmDialog.addEventListener("cancel", event => {
  event.preventDefault();
  dismissFilm();
});
closeOnBackdrop(filmDialog, dismissFilm);
closeOnBackdrop(searchDialog, () => searchDialog.close());
window.addEventListener("hashchange", () => syncRoute(true));
window.addEventListener("pagehide", stopVideo);
syncRoute();
