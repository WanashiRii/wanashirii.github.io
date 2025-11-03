let articlesData = [];

// ===== JSON読み込み =====
fetch('articles.json')
  .then(response => response.json())
  .then(data => {
    articlesData = data;
    renderArticleList();
    handleHashChange(); // 初期ハッシュ対応
  })
  .catch(error => {
    console.error('記事データの読み込みに失敗しました:', error);
  });

// ===== 記事一覧を生成 =====
function renderArticleList() {
  const listContainer = document.querySelector('#articles .content');
  listContainer.innerHTML = '';

  articlesData.forEach(article => {
    const el = document.createElement('article');
    el.setAttribute('data-article', article.id);
    el.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.summary}</p>
    `;
    listContainer.appendChild(el);
  });

  // クリックイベント設定
  document.querySelectorAll('#articles article').forEach(article => {
    article.addEventListener('click', () => {
      const id = article.getAttribute('data-article');
      location.hash = `#article-${id}`; // ← ハッシュ更新
    });
  });
}

// ===== 記事ページを表示 =====
function showArticle(id) {
  const data = articlesData.find(a => a.id == id);
  const container = document.getElementById('article-content');
  container.innerHTML = `
    <h2>${data.title}</h2>
    ${data.content}
    ${data.audio ? `<audio controls src="${data.audio}"></audio>` : ''}
  `;
  showPage('article-page');
}

// ===== ページ切り替え =====
const pages = document.querySelectorAll('.page');
function showPage(pageId) {
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

// ===== ナビゲーション =====
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.dataset.page;
    location.hash = `#${page}`; // ← ハッシュで切り替え
  });
});

// ===== 戻るボタン =====
document.getElementById('back-to-list').addEventListener('click', () => {
  location.hash = '#articles'; // ← ハッシュを使って戻る
});

// ===== ハッシュ監視 =====
window.addEventListener('hashchange', handleHashChange);

function handleHashChange() {
  const hash = location.hash;

  if (!hash || hash === '#home') {
    showPage('home');
  } else if (hash === '#articles') {
    showPage('articles');
  } else if (hash.startsWith('#article-')) {
    const id = hash.replace('#article-', '');
    showArticle(id);
  } else {
    showPage('home'); // 不明なハッシュ → ホームへ
  }
  document.body.style.visibility = 'visible'; // ハッシュ処理後に表示

}
