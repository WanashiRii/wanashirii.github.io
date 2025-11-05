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

// ページ要素一覧
const pages = document.querySelectorAll('.page');

// ===== ヘルパー =====
function stripTags(html) {
  return html ? String(html).replace(/<[^>]*>/g, '') : '';
}
function getSummary(article) {
  if (article.summary) return article.summary;
  const txt = stripTags(article.content || '');
  return txt.length > 120 ? txt.slice(0, 117) + '...' : txt;
}

// ===== 記事一覧を生成 =====
function renderArticleList() {
  const listContainer = document.querySelector('#articles .content');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  articlesData.forEach(article => {
    const el = document.createElement('article');
    el.setAttribute('data-article', article.id);
    el.innerHTML = `
      <h3>${article.title}</h3>
      <p>${getSummary(article)}</p>
    `;
    listContainer.appendChild(el);
  });

  // クリックイベント
  document.querySelectorAll('#articles article').forEach(articleEl => {
    articleEl.addEventListener('click', () => {
      const id = articleEl.getAttribute('data-article');
      history.pushState({ articleId: id }, '', `#article-${id}`);
      handleHashChange();
    });
  });
}

// ===== 個別記事ページ表示 =====
function showArticle(id) {
  const data = articlesData.find(a => String(a.id) === String(id));
  
  const container = date.getElementById('article-content');
  container += document.getElementById('article-content');
  if (!data) {
    history.replaceState({}, '', '#articles');
    showPage('articles');
    return;
  }

  // contentが配列の場合は改行で結合
  let contentHtml = '';
  if (Array.isArray(data.content)) {
    contentHtml = data.content.join('<br>');
  } else {
    contentHtml = data.content || '';
  }

  container.innerHTML = `
    <h2>${data.title}</h2>
    ${contentHtml}
    ${data.audio ? `<audio controls src="${data.audio}"></audio>` : ''}
  `;
  showPage('article-page');
}


// ===== ページ切り替え =====
function showPage(pageId) {
  pages.forEach(p => p.classList.remove('active'));
  const el = document.getElementById(pageId);
  if (el) el.classList.add('active');
}

// ===== ナビゲーション =====
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.dataset.page;
    if (!page) return;
    history.pushState({ page }, '', `#${page}`);
    handleHashChange();
  });
});

// ===== 戻るボタン =====
const backBtn = document.getElementById('back-to-list');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    history.pushState({ page: 'articles' }, '', '#articles');
    handleHashChange();
  });
}

// ===== ハッシュ & 履歴監視 =====
window.addEventListener('hashchange', handleHashChange);
window.addEventListener('popstate', handleHashChange);

function handleHashChange() {
  const hash = location.hash;

  if (!hash || hash === '#home') {
    showPage('home');
  } else if (hash === '#articles') {
    showPage('articles');
  } else if (hash.startsWith('#article-')) {
    const id = hash.replace('#article-', '');
    showArticle(id);
  } else if (hash.startsWith('#')) {
    const id = hash.replace('#', '');
    const target = document.getElementById(id);
    if (target) showPage(id);
    else showPage('home');
  } else {
    showPage('home');
  }

  // ハッシュ処理後に表示
  document.body.style.visibility = 'visible';
}
