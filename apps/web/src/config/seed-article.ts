/**
 * Seed-статья для тестирования layout'ов и превью.
 *
 * Используется:
 * - apps/web — клиентский фронт (demo-страница)
 * - apps/admin — превью в iframe через postMessage
 *
 * Содержит богатый HTML-контент с H2/H3, кодом, списками, цитатами,
 * таблицами — для проверки всех 4 layout-режимов и ToC.
 */

export const seedArticle = {
  title: 'CSS Grid и Flexbox: современная вёрстка без компромиссов',
  subtitle: 'Практическое руководство по двум главным инструментам CSS-лейаута',
  publishedAt: '2026-03-18T10:00:00Z',
  categorySlug: 'frontend',
  categoryName: 'Фронтенд',
  author: 'Николай Егоров',
  tags: ['CSS', 'Grid', 'Flexbox', 'Вёрстка', 'Руководство'],
  layout: 'three-column',

  toc: [
    { id: 'intro', text: 'Введение', level: 2, enabled: true },
    { id: 'grid-basics', text: 'CSS Grid: основы', level: 2, enabled: true },
    {
      id: 'grid-template',
      text: 'Grid Template Areas',
      level: 3,
      enabled: true,
    },
    { id: 'grid-responsive', text: 'Адаптивный Grid', level: 3, enabled: true },
    {
      id: 'flexbox-basics',
      text: 'Flexbox: когда и зачем',
      level: 2,
      enabled: true,
    },
    {
      id: 'flexbox-patterns',
      text: 'Паттерны Flexbox',
      level: 3,
      enabled: true,
    },
    {
      id: 'grid-vs-flexbox',
      text: 'Grid vs Flexbox: что выбрать',
      level: 2,
      enabled: true,
    },
    {
      id: 'real-layouts',
      text: 'Реальные примеры layout-ов',
      level: 2,
      enabled: true,
    },
    {
      id: 'layout-article',
      text: 'Layout статьи',
      level: 3,
      enabled: true,
    },
    {
      id: 'layout-dashboard',
      text: 'Layout дашборда',
      level: 3,
      enabled: true,
    },
    { id: 'pitfalls', text: 'Подводные камни', level: 2, enabled: true },
    { id: 'conclusion', text: 'Заключение', level: 2, enabled: true },
  ],

  content: `
<h2 id="intro">Введение</h2>

<p>
  За последние годы CSS-лейаут прошёл долгий путь — от таблиц и float'ов до двух мощных спецификаций: <strong>CSS Grid</strong> и <strong>Flexbox</strong>. Оба инструмента решают задачу размещения элементов на странице, но делают это по-разному и для разных сценариев.
</p>

<p>
  В этой статье мы разберём оба подхода на практике: когда использовать Grid, когда Flexbox, а когда комбинировать. Все примеры — из реальных проектов, без абстрактных теоретизирований.
</p>

<blockquote>
  <p><strong>Ключевой принцип:</strong> Grid — для двумерных раскладок (строки и колонки одновременно), Flexbox — для одномерных (строка ИЛИ колонка). Если вы думаете о контенте как о сетке — используйте Grid. Если о потоке — Flexbox.</p>
</blockquote>

<h2 id="grid-basics">CSS Grid: основы</h2>

<p>
  CSS Grid Layout — это система двумерного размещения элементов. Вы определяете сетку из строк и колонок, а затем размещаете элементы в ячейках этой сетки. Grid отлично подходит для макетов страниц, карточных сеток и любых задач, где нужен контроль по обеим осям.
</p>

<pre><code>.container {
  display: grid;
  grid-template-columns: 200px 1fr 300px;
  grid-template-rows: auto 1fr auto;
  gap: 24px;
  min-height: 100vh;
}

.header  { grid-column: 1 / -1; }
.sidebar { grid-column: 1; }
.content { grid-column: 2; }
.aside   { grid-column: 3; }
.footer  { grid-column: 1 / -1; }</code></pre>

<p>
  Обратите внимание на <code>grid-column: 1 / -1</code> — это растягивает элемент на все колонки. Отрицательные индексы считают с конца, что делает код устойчивым к изменению количества колонок.
</p>

<h3 id="grid-template">Grid Template Areas</h3>

<p>
  Один из самых мощных инструментов Grid — именованные области. Они позволяют описать раскладку визуально, прямо в CSS:
</p>

<pre><code>.page {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "toc     content sidebar"
    "footer  footer  footer";
  grid-template-columns: 200px 1fr 280px;
  grid-template-rows: auto 1fr auto;
}

.header  { grid-area: header; }
.toc     { grid-area: toc; }
.content { grid-area: content; }
.sidebar { grid-area: sidebar; }
.footer  { grid-area: footer; }</code></pre>

<p>
  Этот подход особенно удобен для адаптивной вёрстки — при смене breakpoint достаточно переопределить <code>grid-template-areas</code>, не трогая сами элементы.
</p>

<h3 id="grid-responsive">Адаптивный Grid</h3>

<p>
  Grid с <code>auto-fit</code> и <code>minmax()</code> позволяет создавать адаптивные сетки без единого media query:
</p>

<pre><code>.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}</code></pre>

<p>Эта одна строка создаёт сетку, которая:</p>

<ul>
  <li>Заполняет всю доступную ширину</li>
  <li>Создаёт столько колонок, сколько помещается (минимум 280px каждая)</li>
  <li>Автоматически перестраивается при изменении размера окна</li>
  <li>Не требует <code>@media</code>-правил</li>
</ul>

<p>
  Разница между <code>auto-fit</code> и <code>auto-fill</code>: <code>auto-fit</code> коллапсирует пустые треки, растягивая существующие элементы. <code>auto-fill</code> сохраняет пустые треки. В большинстве случаев вам нужен <code>auto-fit</code>.
</p>

<h2 id="flexbox-basics">Flexbox: когда и зачем</h2>

<p>
  Flexbox — это одномерная система раскладки. Несмотря на то, что элементы могут переноситься на новые строки (<code>flex-wrap</code>), основная логика Flexbox работает вдоль одной оси. Это делает его идеальным для:
</p>

<ul>
  <li><strong>Навигации</strong> — горизонтальный список ссылок с равномерным распределением</li>
  <li><strong>Карточек</strong> — одинаковая высота в ряду</li>
  <li><strong>Центрирования</strong> — вертикальное и горизонтальное</li>
  <li><strong>Тулбаров</strong> — группы кнопок с разным выравниванием</li>
  <li><strong>Медиа-объектов</strong> — аватар + текст</li>
</ul>

<pre><code>.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar__spacer {
  flex: 1; /* Занимает всё свободное пространство */
}

.toolbar__group {
  display: flex;
  gap: 4px;
}</code></pre>

<h3 id="flexbox-patterns">Паттерны Flexbox</h3>

<p>Несколько паттернов, которые покрывают 90% задач:</p>

<p><strong>1. Holy Grail центрирование:</strong></p>

<pre><code>.center {
  display: flex;
  align-items: center;
  justify-content: center;
}</code></pre>

<p><strong>2. Spacer-паттерн</strong> (элементы по краям, пробел в середине):</p>

<pre><code>.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}</code></pre>

<p><strong>3. Равномерные карточки:</strong></p>

<pre><code>.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 300px; /* Растут, сжимаются, базис 300px */
  max-width: 400px;
}</code></pre>

<p>
  Заметьте <code>max-width</code> на карточках — без него последняя карточка в ряду может растянуться на всю ширину, если она одна в строке.
</p>

<h2 id="grid-vs-flexbox">Grid vs Flexbox: что выбрать</h2>

<p>
  Частый вопрос: «Когда Grid, когда Flexbox?» Простое правило:
</p>

<table>
  <thead>
    <tr>
      <th>Критерий</th>
      <th>CSS Grid</th>
      <th>Flexbox</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Размерность</td>
      <td>Двумерная (строки + колонки)</td>
      <td>Одномерная (строка ИЛИ колонка)</td>
    </tr>
    <tr>
      <td>Подход</td>
      <td>Layout-first (сначала сетка)</td>
      <td>Content-first (сначала контент)</td>
    </tr>
    <tr>
      <td>Выравнивание</td>
      <td>По обеим осям одновременно</td>
      <td>По одной оси + перпендикулярная</td>
    </tr>
    <tr>
      <td>Overlap</td>
      <td>Да (элементы могут перекрываться)</td>
      <td>Нет</td>
    </tr>
    <tr>
      <td>Порядок</td>
      <td>Свободное размещение по ячейкам</td>
      <td>Линейный порядок</td>
    </tr>
    <tr>
      <td>Лучше для</td>
      <td>Макет страницы, сетки карточек</td>
      <td>Компоненты, навигация, тулбары</td>
    </tr>
  </tbody>
</table>

<p>
  На практике они отлично работают вместе: Grid для макроструктуры страницы, Flexbox для микрокомпонентов внутри ячеек Grid.
</p>

<h2 id="real-layouts">Реальные примеры layout-ов</h2>

<p>
  Рассмотрим два реальных примера из проекта ProfitableWeb — layout статьи и layout дашборда.
</p>

<h3 id="layout-article">Layout статьи</h3>

<p>
  Для длинных статей с оглавлением используем трёхколоночный Grid: навигация по оглавлению слева, контент в центре, метаданные автора справа. На планшетах оглавление скрывается, на мобильных — остаётся только контент.
</p>

<pre><code>.article-layout {
  display: grid;
  grid-template-columns: 200px 1fr 280px;
  gap: 60px;
  max-width: 1600px;
  margin: 0 auto;
}

/* Явные привязки — защита от пропущенных элементов */
.article-layout__toc     { grid-column: 1; }
.article-layout__content { grid-column: 2; }
.article-layout__sidebar { grid-column: 3; }

@media (max-width: 1400px) {
  .article-layout {
    grid-template-columns: 1fr 300px;
  }
  .article-layout__toc { display: none; }
  .article-layout__content { grid-column: 1; }
  .article-layout__sidebar { grid-column: 2; }
}

@media (max-width: 900px) {
  .article-layout {
    grid-template-columns: 1fr;
  }
  .article-layout__sidebar { display: none; }
  .article-layout__content { grid-column: 1; }
}</code></pre>

<p>
  Ключевой момент — явные <code>grid-column</code> привязки на каждом breakpoint. Без них, если один из элементов отсутствует в DOM (например, ToC не сгенерирован), Grid auto-placement может поместить контент не в ту колонку.
</p>

<h3 id="layout-dashboard">Layout дашборда</h3>

<p>
  Дашборд использует комбинацию Grid и Flexbox. Grid — для размещения виджетов в сетке, Flexbox — для контента внутри каждого виджета:
</p>

<pre><code>.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.widget {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: var(--surface);
  overflow: hidden;
}

.widget__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.widget__body {
  flex: 1;
  padding: 0 20px 20px;
}</code></pre>

<p>
  Grid управляет размещением виджетов по сетке, Flexbox — внутренней структурой каждого виджета. Это типичный паттерн «Grid снаружи, Flex внутри».
</p>

<h2 id="pitfalls">Подводные камни</h2>

<p>Несколько распространённых проблем при работе с Grid и Flexbox:</p>

<ol>
  <li>
    <strong>min-width: 0 в Grid.</strong> По умолчанию grid-элемент не может быть уже своего контента (<code>min-width: auto</code>). Если у вас длинный текст или <code>overflow</code> не работает — добавьте <code>min-width: 0</code> на ячейку.
  </li>
  <li>
    <strong>flex-shrink: 0 для фиксированных элементов.</strong> Если элемент в flex-контейнере не должен сжиматься (иконка, аватар), поставьте <code>flex-shrink: 0</code>, иначе он деформируется.
  </li>
  <li>
    <strong>gap vs margin.</strong> Свойство <code>gap</code> поддерживается обоими инструментами. Используйте его вместо margin для отступов между элементами — это проще и не создаёт лишние отступы по краям.
  </li>
  <li>
    <strong>auto-placement порядок.</strong> CSS Grid размещает элементы слева направо, сверху вниз. Если элемент отсутствует в DOM, следующие сдвигаются — используйте явные <code>grid-column</code> / <code>grid-row</code> для критичных элементов.
  </li>
  <li>
    <strong>Safari и aspect-ratio в Grid.</strong> В Safari <code>aspect-ratio</code> внутри grid-ячейки может работать некорректно. Обходное решение — обёртка с <code>padding-top</code> в процентах.
  </li>
</ol>

<h2 id="conclusion">Заключение</h2>

<p>
  CSS Grid и Flexbox — не конкуренты, а партнёры. Grid берёт на себя структуру страницы (макрo-layout), Flexbox — организацию внутри компонентов (микро-layout). Вместе они покрывают практически любую задачу современной вёрстки без костылей и хаков.
</p>

<p>
  Основные рекомендации:
</p>

<ul>
  <li>Начинайте с Grid для страничных макетов — <code>grid-template-columns</code> + <code>grid-template-areas</code></li>
  <li>Используйте Flexbox для компонентов — навигация, тулбары, карточки</li>
  <li>Комбинируйте: Grid снаружи, Flex внутри</li>
  <li>Всегда указывайте <code>grid-column</code> явно для критичных элементов</li>
  <li>Тестируйте на реальных breakpoints — DevTools недостаточно</li>
</ul>

<blockquote>
  <p><strong>Совет:</strong> Не бойтесь вложенных Grid. Вложенный Grid внутри Grid-ячейки — это нормально и часто удобнее, чем пытаться решить всё одной сеткой. Subgrid (поддерживается во всех современных браузерах с 2023) делает это ещё удобнее.</p>
</blockquote>
`.trim(),

  selfCheck: [
    {
      id: '1',
      question: 'В чём основное различие между CSS Grid и Flexbox?',
      answer:
        'Grid — двумерная система (строки и колонки), Flexbox — одномерная (строка ИЛИ колонка)',
    },
    {
      id: '2',
      question:
        'Что делает grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))?',
      answer:
        'Создаёт адаптивную сетку, которая автоматически подстраивает количество колонок под ширину контейнера (минимум 280px на колонку)',
    },
    {
      id: '3',
      question: 'Зачем нужен min-width: 0 на grid-элементах?',
      answer:
        'Чтобы элемент мог быть уже своего контента — по умолчанию min-width: auto не даёт ячейке сжаться',
    },
    {
      id: '4',
      question: 'Почему важны явные grid-column привязки?',
      answer:
        'Без них, если элемент отсутствует в DOM, auto-placement может поместить контент не в ту колонку',
    },
  ],

  sources: [
    {
      id: '1',
      title: 'CSS Grid Layout — MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout',
      type: 'documentation',
    },
    {
      id: '2',
      title: 'A Complete Guide to CSS Grid — CSS-Tricks',
      url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
      type: 'article',
    },
    {
      id: '3',
      title: 'Flexbox Froggy — интерактивный тренажёр',
      url: 'https://flexboxfroggy.com/',
      type: 'tool',
    },
    {
      id: '4',
      title: 'CSS Subgrid — спецификация',
      url: 'https://www.w3.org/TR/css-grid-2/#subgrids',
      type: 'specification',
    },
  ],
};
