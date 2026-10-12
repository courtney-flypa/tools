const $ = (id) => document.getElementById(id);
const list = $('tool-list');
const search = $('search');
const category = $('category');
let tools = [];

function textElement(tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const matches = tools.filter((tool) => (!category.value || tool.category === category.value)
    && [tool.title, tool.description, tool.category, ...tool.tags].join(' ').toLocaleLowerCase().includes(query));
  list.replaceChildren(...matches.map((tool) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'tool-link';
    link.href = `/${tool.slug}/`;
    const body = document.createElement('div');
    const meta = textElement('div', '', 'tool-meta');
    const date = textElement('time', tool.date);
    date.dateTime = tool.date;
    meta.append(textElement('span', tool.category), date);
    body.append(textElement('h3', tool.title), textElement('p', tool.description), meta);
    const arrow = textElement('span', '↗', 'tool-arrow');
    arrow.setAttribute('aria-hidden', 'true');
    link.append(body, arrow);
    item.append(link);
    return item;
  }));
  $('empty-state').hidden = matches.length > 0;
  $('result-count').hidden = tools.length === 0;
  $('result-count').textContent = `顯示 ${matches.length} 個工具，共 ${tools.length} 個`;
  if (tools.length > 0) {
    $('empty-title').textContent = '還沒找到符合的工具。';
    $('empty-copy').textContent = '試試其他關鍵字，或清除篩選看看全部工具。';
    $('clear-search').hidden = matches.length > 0;
  }
}

try {
  const response = await fetch('/tools.json');
  if (!response.ok) throw new Error('Catalog unavailable');
  tools = await response.json();
  if (!Array.isArray(tools) || tools.some((tool) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool.slug)
    || !['title', 'description', 'category', 'date'].every((key) => typeof tool[key] === 'string')
    || !Array.isArray(tool.tags))) throw new Error('Invalid catalog');
  tools.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-Hant'));
  $('total').textContent = String(tools.length).padStart(2, '0');
  $('filters').hidden = tools.length === 0;
  [...new Set(tools.map((tool) => tool.category))].sort().forEach((name) => {
    const option = textElement('option', name);
    option.value = name;
    category.append(option);
  });
  render();
} catch {
  $('empty-title').textContent = '工具目錄暫時無法載入。';
  $('empty-copy').textContent = '請稍後重新整理頁面再試一次。';
  $('total').textContent = '—';
}

search.addEventListener('input', render);
category.addEventListener('change', render);
$('clear-search').addEventListener('click', () => { search.value = ''; category.value = ''; render(); search.focus(); });
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !$('filters').hidden
    && !event.target.closest('input, textarea, select, [contenteditable="true"]')) {
    event.preventDefault();
    search.focus();
  }
});
