"""
Обогащение seed-статей полноценным HTML-контентом, ToC и артефактами.

Запуск: cd apps/api && uv run python -m src.enrich_articles

Обновляет существующие статьи в БД:
- 5 статей с rich-контентом (разные layout'ы, ToC, selfCheck, sources)
- Остальные — с базовым контентом из 3–5 абзацев
"""

from sqlalchemy.orm import Session

from src.core.database import SessionLocal
from src.models.article import Article, ArticleLayout


# ---------------------------------------------------------------------------
# Rich content: «Психоинженерия» → three-column
# ---------------------------------------------------------------------------
PSYCHO_CONTENT = """
<h2 id="intro">Введение</h2>

<p>
  Бурное развитие ИИ активно оптимизирует существующие профессии, а также создаёт новые. Одна из них — <strong>психоинженерия</strong>: область на стыке психологии, когнитивных наук, нейронаук, дизайна человеко-машинных интерфейсов и разработки ИИ.
</p>

<p>
  Психоинженер проектирует <em>когнитивный интерфейс</em> между человеком и интеллектуальной системой. Его задача — сделать так, чтобы взаимодействие было не просто удобным, а <strong>когнитивно комфортным</strong>: снижало когнитивную нагрузку, формировало доверие и не вызывало «долину ИИ-страха».
</p>

<blockquote>
  <p><strong>Ключевой принцип:</strong> Технология должна адаптироваться к человеку, а не человек к технологии. Психоинженерия проектирует этот мост.</p>
</blockquote>

<h2 id="what-is">Что такое психоинженерия</h2>

<p>
  Термин <strong>Software 3.0</strong> описывает парадигму, в которой программы строятся не на жёстких алгоритмах (Software 1.0) и не на обученных нейросетях (Software 2.0), а на естественном языке и intent-driven интерфейсах. В этой парадигме ключевое значение приобретают:
</p>

<ul>
  <li><strong>Когнитивная архитектура</strong> — как пользователь строит ментальную модель системы</li>
  <li><strong>Эмоциональный дизайн</strong> — как система формирует доверие и снижает тревожность</li>
  <li><strong>Нейроэргономика</strong> — как минимизировать когнитивную нагрузку при работе с ИИ</li>
  <li><strong>Этика взаимодействия</strong> — границы манипуляции и persuasive design</li>
</ul>

<h2 id="cognitive-load">Когнитивная нагрузка в ИИ-интерфейсах</h2>

<p>
  Теория когнитивной нагрузки (Sweller, 1988) выделяет три типа нагрузки: intrinsic (сложность задачи), extraneous (сложность интерфейса) и germane (усилие на обучение). Психоинженер работает прежде всего с extraneous нагрузкой.
</p>

<h3 id="cognitive-patterns">Паттерны снижения нагрузки</h3>

<p>Несколько проверенных паттернов:</p>

<ol>
  <li>
    <strong>Progressive disclosure.</strong> Не показывать все возможности ИИ сразу. Начинать с простого интерфейса, раскрывая сложность по мере роста экспертизы пользователя.
  </li>
  <li>
    <strong>Chunking.</strong> Длинные ответы ИИ разбивать на логические блоки с заголовками, списками и визуальными якорями.
  </li>
  <li>
    <strong>Confidence calibration.</strong> Показывать уверенность модели — «Я не уверен, но...» снижает когнитивный диссонанс при ошибках.
  </li>
  <li>
    <strong>Affordance mapping.</strong> Визуальные подсказки о том, что система может и чего не может.
  </li>
</ol>

<pre><code>// Пример: Progressive disclosure в чат-интерфейсе
interface ChatConfig {
  initialMode: 'simple';       // Только текстовый ввод
  advancedFeatures: {
    codeExecution: boolean;    // Включается после 5 сессий
    fileUpload: boolean;       // Включается после 10 сессий
    customPrompts: boolean;    // Включается по запросу
  };
  cognitiveLoad: 'low' | 'medium' | 'high';
}</code></pre>

<h2 id="trust-formation">Формирование доверия</h2>

<p>
  Исследования (Hancock et al., 2020) показывают, что доверие к ИИ-системам формируется через три канала: <strong>компетентность</strong> (система даёт правильные ответы), <strong>предсказуемость</strong> (поведение консистентно) и <strong>прозрачность</strong> (пользователь понимает, почему система приняла решение).
</p>

<table>
  <thead>
    <tr>
      <th>Канал доверия</th>
      <th>Дизайн-паттерн</th>
      <th>Пример</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Компетентность</td>
      <td>Демонстрация экспертизы</td>
      <td>«Я обучен на 1.5 млн медицинских статей»</td>
    </tr>
    <tr>
      <td>Предсказуемость</td>
      <td>Консистентный тон и формат</td>
      <td>Всегда одна структура ответа</td>
    </tr>
    <tr>
      <td>Прозрачность</td>
      <td>Explainability</td>
      <td>«Я рекомендую X, потому что...»</td>
    </tr>
  </tbody>
</table>

<h2 id="uncanny-valley">Долина ИИ-страха</h2>

<p>
  По аналогии с uncanny valley в робототехнике, существует эффект «долины ИИ-страха» — зона, в которой система достаточно умна, чтобы казаться разумной, но недостаточно — чтобы не ошибаться в критичных местах. Это вызывает тревожность и отторжение.
</p>

<p>
  Психоинженер работает с этим эффектом через:
</p>

<ul>
  <li><strong>Honest framing</strong> — честное позиционирование возможностей и ограничений</li>
  <li><strong>Graceful degradation</strong> — элегантная обработка ошибок с объяснением</li>
  <li><strong>Human-in-the-loop</strong> — явные точки передачи контроля человеку</li>
</ul>

<h2 id="ethics">Этика и границы</h2>

<p>
  Психоинженерия балансирует на грани: одни и те же инструменты можно использовать для помощи пользователю и для манипуляции. Dark patterns в ИИ-интерфейсах особенно опасны, потому что пользователь склонен антропоморфизировать систему и доверять ей больше, чем обычному софту.
</p>

<blockquote>
  <p><strong>Правило:</strong> Если дизайн-решение работает только потому, что пользователь не понимает, что происходит — это манипуляция, а не психоинженерия.</p>
</blockquote>

<h2 id="skills">Навыки психоинженера</h2>

<p>Основные компетенции специалиста:</p>

<ol>
  <li><strong>Когнитивная психология</strong> — модели восприятия, внимания, памяти</li>
  <li><strong>UX Research</strong> — количественные и качественные методы исследования</li>
  <li><strong>Prompt engineering</strong> — проектирование системных промптов и поведения ИИ</li>
  <li><strong>Нейроэтика</strong> — принципы ответственного проектирования</li>
  <li><strong>Прототипирование</strong> — быстрое создание и тестирование интерфейсов</li>
</ol>

<h2 id="conclusion">Заключение</h2>

<p>
  Психоинженерия — не мода, а неизбежность. По мере того как ИИ-системы становятся сложнее и ближе к пользователю, потребность в специалистах, которые понимают <em>и</em> технологию, <em>и</em> человека, будет только расти. Это не замена UX-дизайнера и не разновидность prompt engineer — это новая роль, которая объединяет лучшее из обеих дисциплин.
</p>
""".strip()

PSYCHO_TOC = [
    {"id": "intro", "text": "Введение", "level": 2, "enabled": True},
    {"id": "what-is", "text": "Что такое психоинженерия", "level": 2, "enabled": True},
    {"id": "cognitive-load", "text": "Когнитивная нагрузка в ИИ-интерфейсах", "level": 2, "enabled": True},
    {"id": "cognitive-patterns", "text": "Паттерны снижения нагрузки", "level": 3, "enabled": True},
    {"id": "trust-formation", "text": "Формирование доверия", "level": 2, "enabled": True},
    {"id": "uncanny-valley", "text": "Долина ИИ-страха", "level": 2, "enabled": True},
    {"id": "ethics", "text": "Этика и границы", "level": 2, "enabled": True},
    {"id": "skills", "text": "Навыки психоинженера", "level": 2, "enabled": True},
    {"id": "conclusion", "text": "Заключение", "level": 2, "enabled": True},
]

PSYCHO_ARTIFACTS = {
    "selfCheck": {
        "enabled": True,
        "items": [
            {"id": "1", "question": "Что такое extraneous когнитивная нагрузка?", "answer": "Нагрузка, вызванная сложностью интерфейса (а не задачи). Психоинженер работает прежде всего с ней."},
            {"id": "2", "question": "Через какие три канала формируется доверие к ИИ?", "answer": "Компетентность, предсказуемость и прозрачность."},
            {"id": "3", "question": "Что такое «долина ИИ-страха»?", "answer": "Зона, где система достаточно умна, чтобы казаться разумной, но недостаточно — чтобы не ошибаться в критичных местах, что вызывает тревожность."},
        ],
    },
    "sources": {
        "enabled": True,
        "items": [
            {"id": "1", "title": "Cognitive Load Theory — Sweller (1988)", "url": "https://en.wikipedia.org/wiki/Cognitive_load", "type": "article"},
            {"id": "2", "title": "Trust in Human-Robot Interaction — Hancock et al.", "url": "https://journals.sagepub.com/doi/10.1177/0018720811417254", "type": "article"},
            {"id": "3", "title": "Emotional Design — Don Norman", "url": "https://www.nngroup.com/books/emotional-design/", "type": "book"},
        ],
    },
    "glossary": {"enabled": False, "items": []},
    "provenance": {"enabled": False, "workspaceId": "", "showLink": False},
}


# ---------------------------------------------------------------------------
# Rich content: «Figma для веб-дизайнеров» → two-column
# ---------------------------------------------------------------------------
FIGMA_CONTENT = """
<h2 id="intro">Введение</h2>

<p>
  Figma стала индустриальным стандартом для UI/UX дизайна. Браузерная, коллаборативная, с мощной системой компонентов — она изменила то, как дизайнеры работают с веб-проектами.
</p>

<p>
  В этой статье мы пройдём полный цикл: от создания дизайн-системы до передачи макетов в разработку с помощью Dev Mode и Code Connect.
</p>

<h2 id="design-system">Создание дизайн-системы</h2>

<p>
  Любой серьёзный проект начинается с <strong>дизайн-системы</strong> — набора переиспользуемых компонентов, стилей и правил. В Figma для этого используются:
</p>

<ul>
  <li><strong>Variables</strong> — цвета, отступы, размеры шрифтов как переменные</li>
  <li><strong>Components</strong> — переиспользуемые элементы с variants и props</li>
  <li><strong>Auto Layout</strong> — аналог Flexbox для автоматического расположения элементов</li>
  <li><strong>Styles</strong> — типографика, тени, эффекты</li>
</ul>

<h3 id="variables">Variables и темизация</h3>

<p>
  Figma Variables позволяют создать light/dark тему одним переключением. Каждый цвет определяется как переменная, а не как hex-значение. При изменении переменной обновляются все компоненты автоматически.
</p>

<pre><code>// Пример маппинга Figma Variables → CSS Custom Properties
:root {
  --color-bg-primary: var(--figma-surface);
  --color-text-primary: var(--figma-on-surface);
  --color-accent: var(--figma-primary);
  --spacing-sm: var(--figma-spacing-100);
  --spacing-md: var(--figma-spacing-200);
}</code></pre>

<h2 id="components">Компонентная архитектура</h2>

<p>
  Хороший компонент в Figma зеркалит React-компонент: у него есть <strong>props</strong> (свойства), <strong>variants</strong> (состояния), <strong>slots</strong> (вложенные элементы). Это облегчает передачу макетов в разработку.
</p>

<h3 id="variants">Variants vs Boolean props</h3>

<p>
  В Figma можно задавать свойства компонента двумя способами: через <strong>variants</strong> (переключатель между состояниями) и через <strong>boolean props</strong> (показать/скрыть элемент). Правило:
</p>

<ul>
  <li>Используйте variants для визуально разных состояний (primary/secondary/ghost button)</li>
  <li>Используйте boolean props для наличия/отсутствия элементов (иконка, бейдж)</li>
  <li>Используйте text props для контента (лейбл, описание)</li>
</ul>

<h2 id="auto-layout">Auto Layout = Flexbox</h2>

<p>
  Auto Layout в Figma — это по сути Flexbox. Свойства маппятся 1:1:
</p>

<table>
  <thead>
    <tr>
      <th>Figma</th>
      <th>CSS Flexbox</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Horizontal / Vertical</td>
      <td>flex-direction: row / column</td>
    </tr>
    <tr>
      <td>Gap</td>
      <td>gap</td>
    </tr>
    <tr>
      <td>Padding</td>
      <td>padding</td>
    </tr>
    <tr>
      <td>Fill container</td>
      <td>flex: 1</td>
    </tr>
    <tr>
      <td>Hug contents</td>
      <td>width: fit-content</td>
    </tr>
    <tr>
      <td>Space between</td>
      <td>justify-content: space-between</td>
    </tr>
  </tbody>
</table>

<h2 id="dev-mode">Dev Mode и передача в разработку</h2>

<p>
  Figma Dev Mode показывает разработчику: CSS-код элемента, отступы, цвета, типографику. Но самое мощное — <strong>Code Connect</strong>: привязка Figma-компонентов к React-компонентам в коде.
</p>

<pre><code>// Code Connect: маппинг Figma → React
figma.connect(Button, 'https://figma.com/file/.../Button', {
  props: {
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Ghost: 'ghost',
    }),
    label: figma.string('Label'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ variant, label, disabled }) =&gt;
    &lt;Button variant={variant} disabled={disabled}&gt;{label}&lt;/Button&gt;
});</code></pre>

<h2 id="handoff">Процесс передачи макетов</h2>

<p>Рекомендуемый workflow:</p>

<ol>
  <li><strong>Дизайн</strong> — создание макетов с Auto Layout и Variables</li>
  <li><strong>Ревью</strong> — презентация дизайна команде через Figma comments</li>
  <li><strong>Спецификация</strong> — аннотирование поведения (hover, transitions, responsive)</li>
  <li><strong>Code Connect</strong> — привязка компонентов к коду</li>
  <li><strong>Реализация</strong> — разработчик видит точный код для каждого элемента</li>
</ol>

<h2 id="conclusion">Заключение</h2>

<p>
  Figma — не просто «рисовалка макетов». При правильном использовании это мост между дизайном и кодом. Variables → CSS Custom Properties, Auto Layout → Flexbox, Components → React Components. Чем точнее маппинг, тем меньше потерь при передаче в разработку.
</p>
""".strip()

FIGMA_TOC = [
    {"id": "intro", "text": "Введение", "level": 2, "enabled": True},
    {"id": "design-system", "text": "Создание дизайн-системы", "level": 2, "enabled": True},
    {"id": "variables", "text": "Variables и темизация", "level": 3, "enabled": True},
    {"id": "components", "text": "Компонентная архитектура", "level": 2, "enabled": True},
    {"id": "variants", "text": "Variants vs Boolean props", "level": 3, "enabled": True},
    {"id": "auto-layout", "text": "Auto Layout = Flexbox", "level": 2, "enabled": True},
    {"id": "dev-mode", "text": "Dev Mode и передача в разработку", "level": 2, "enabled": True},
    {"id": "handoff", "text": "Процесс передачи макетов", "level": 2, "enabled": True},
    {"id": "conclusion", "text": "Заключение", "level": 2, "enabled": True},
]

FIGMA_ARTIFACTS = {
    "selfCheck": {
        "enabled": True,
        "items": [
            {"id": "1", "question": "Какой аналог Auto Layout в CSS?", "answer": "Flexbox — свойства маппятся 1:1 (gap, padding, direction)."},
            {"id": "2", "question": "Для чего нужен Code Connect?", "answer": "Для привязки Figma-компонентов к React-компонентам, чтобы Dev Mode показывал реальный код."},
        ],
    },
    "sources": {
        "enabled": True,
        "items": [
            {"id": "1", "title": "Figma Dev Mode — официальная документация", "url": "https://help.figma.com/hc/en-us/categories/360002051613", "type": "documentation"},
            {"id": "2", "title": "Code Connect — GitHub", "url": "https://github.com/figma/code-connect", "type": "tool"},
        ],
    },
    "glossary": {"enabled": False, "items": []},
    "provenance": {"enabled": False, "workspaceId": "", "showLink": False},
}


# ---------------------------------------------------------------------------
# Rich content: «Email-маркетинг» → one-column
# ---------------------------------------------------------------------------
EMAIL_CONTENT = """
<h2 id="intro">Введение</h2>

<p>
  Email остаётся самым ROI-эффективным каналом маркетинга. По данным DMA, средний ROI email-маркетинга — $42 на каждый потраченный доллар. Но чтобы достичь таких результатов, нужна системная работа над базой подписчиков.
</p>

<p>
  В этой статье — практическое руководство по построению email-базы с нуля до 10 000 лояльных читателей.
</p>

<h2 id="lead-magnets">Lead Magnets: первый шаг</h2>

<p>
  Никто не подписывается на «рассылку». Люди подписываются на <strong>ценность</strong>. Lead magnet — это бесплатный ресурс в обмен на email. Эффективные форматы:
</p>

<ul>
  <li><strong>Чеклист</strong> — компактный, конкретный, немедленно полезный</li>
  <li><strong>Мини-курс</strong> — серия из 5–7 писем, обучающих одному навыку</li>
  <li><strong>Шаблон/инструмент</strong> — то, что экономит время (Excel, Notion, Figma)</li>
  <li><strong>Исследование</strong> — уникальные данные, которых нет в открытом доступе</li>
</ul>

<blockquote>
  <p><strong>Правило:</strong> Lead magnet должен решать одну конкретную проблему за 5 минут. Не ebook на 50 страниц — а одностраничный чеклист.</p>
</blockquote>

<h2 id="opt-in-forms">Формы подписки</h2>

<p>
  Конверсия формы подписки зависит от трёх факторов: <strong>placement</strong> (где), <strong>timing</strong> (когда), <strong>copy</strong> (что написано).
</p>

<h3 id="placement">Placement</h3>

<p>Лучшие места для формы подписки на блоге:</p>

<ol>
  <li><strong>Внутри контента</strong> (после 2-го абзаца) — конверсия 3–5%</li>
  <li><strong>В конце статьи</strong> — конверсия 1–3%</li>
  <li><strong>Sticky sidebar</strong> — конверсия 1–2%</li>
  <li><strong>Exit intent popup</strong> — конверсия 2–4%</li>
  <li><strong>Welcome mat</strong> (полноэкранный) — конверсия 5–8%, но раздражает</li>
</ol>

<h2 id="segmentation">Сегментация</h2>

<p>
  Рассылка «всем обо всём» не работает. Сегментация повышает open rate на 14% и click rate на 100% (Mailchimp, 2023). Основные критерии сегментации:
</p>

<table>
  <thead>
    <tr>
      <th>Критерий</th>
      <th>Пример</th>
      <th>Применение</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Источник подписки</td>
      <td>Блог / Подкаст / Twitter</td>
      <td>Разный тон и формат</td>
    </tr>
    <tr>
      <td>Интерес</td>
      <td>SEO / Контент / Дизайн</td>
      <td>Релевантные темы</td>
    </tr>
    <tr>
      <td>Активность</td>
      <td>Открывает / Не открывает</td>
      <td>Re-engagement кампании</td>
    </tr>
    <tr>
      <td>Стадия воронки</td>
      <td>Новичок / Продвинутый</td>
      <td>Глубина контента</td>
    </tr>
  </tbody>
</table>

<h2 id="automation">Автоматические серии</h2>

<p>
  Автоматические email-серии — основа масштабирования. Три обязательные серии:
</p>

<ul>
  <li><strong>Welcome-серия</strong> (5 писем) — знакомство, лучший контент, призыв к действию</li>
  <li><strong>Nurture-серия</strong> (10+ писем) — обучение и вовлечение</li>
  <li><strong>Re-engagement</strong> (3 письма) — возврат неактивных подписчиков</li>
</ul>

<h2 id="metrics">Метрики и оптимизация</h2>

<p>Ключевые метрики email-маркетинга:</p>

<ul>
  <li><strong>Open rate</strong> — цель: 25–35% (зависит от ниши)</li>
  <li><strong>Click rate</strong> — цель: 3–5%</li>
  <li><strong>Unsubscribe rate</strong> — норма: &lt;0.5% на выпуск</li>
  <li><strong>List growth rate</strong> — цель: 5–10% в месяц</li>
</ul>

<h2 id="conclusion">Заключение</h2>

<p>
  Email-маркетинг — это марафон, не спринт. Первые 1000 подписчиков — самые сложные. Но с правильным lead magnet, сегментацией и автоматизацией рост становится предсказуемым. Главное — давать ценность в каждом письме.
</p>
""".strip()

EMAIL_TOC = [
    {"id": "intro", "text": "Введение", "level": 2, "enabled": True},
    {"id": "lead-magnets", "text": "Lead Magnets: первый шаг", "level": 2, "enabled": True},
    {"id": "opt-in-forms", "text": "Формы подписки", "level": 2, "enabled": True},
    {"id": "placement", "text": "Placement", "level": 3, "enabled": True},
    {"id": "segmentation", "text": "Сегментация", "level": 2, "enabled": True},
    {"id": "automation", "text": "Автоматические серии", "level": 2, "enabled": True},
    {"id": "metrics", "text": "Метрики и оптимизация", "level": 2, "enabled": True},
    {"id": "conclusion", "text": "Заключение", "level": 2, "enabled": True},
]

EMAIL_ARTIFACTS = {
    "selfCheck": {
        "enabled": True,
        "items": [
            {"id": "1", "question": "Какой средний ROI email-маркетинга?", "answer": "$42 на каждый потраченный доллар (DMA)."},
            {"id": "2", "question": "Что такое lead magnet?", "answer": "Бесплатный ресурс (чеклист, шаблон, мини-курс) в обмен на email."},
            {"id": "3", "question": "На сколько сегментация повышает click rate?", "answer": "На 100% по данным Mailchimp."},
        ],
    },
    "sources": {
        "enabled": True,
        "items": [
            {"id": "1", "title": "Email Marketing Benchmarks — Mailchimp", "url": "https://mailchimp.com/resources/email-marketing-benchmarks/", "type": "article"},
            {"id": "2", "title": "DMA Email Marketing ROI Report", "url": "https://dma.org.uk/", "type": "article"},
        ],
    },
    "glossary": {"enabled": False, "items": []},
    "provenance": {"enabled": False, "workspaceId": "", "showLink": False},
}


# ---------------------------------------------------------------------------
# Rich content: «Tailwind CSS» → full-width
# ---------------------------------------------------------------------------
TAILWIND_CONTENT = """
<h2 id="intro">Введение</h2>

<p>
  Tailwind CSS ускоряет разработку интерфейсов в 2–3 раза. Utility-first подход кажется спорным поначалу — «это же инлайн-стили!» — но на практике даёт предсказуемый, масштабируемый и легко поддерживаемый CSS.
</p>

<h2 id="why-utility">Почему Utility-first</h2>

<p>
  Традиционный CSS (BEM, SMACSS) создаёт абстракции: <code>.card__header--active</code>. Проблема: абстракции протекают. Через полгода никто не помнит, что делает <code>.card__header--active</code>, и проще написать новый класс.
</p>

<p>
  Utility-first убирает этот слой абстракции. Вместо <code>.card__header</code> вы пишете <code>flex items-center gap-2 px-4 py-3 bg-white</code>. Звучит многословно, но:
</p>

<ul>
  <li><strong>Нет конфликтов</strong> — каждый класс делает ровно одно свойство</li>
  <li><strong>Нет наследования</strong> — стили не «протекают» к дочерним элементам</li>
  <li><strong>Нет мёртвого CSS</strong> — Tailwind tree-shakes неиспользованные утилиты</li>
  <li><strong>Легко читать</strong> — все стили видны прямо в разметке</li>
</ul>

<h2 id="config">Конфигурация</h2>

<p>
  Сила Tailwind — в <code>tailwind.config.ts</code>. Здесь определяется дизайн-система проекта: цвета, шрифты, отступы, breakpoints.
</p>

<pre><code>// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
} satisfies Config;</code></pre>

<h2 id="components">Компонентный подход</h2>

<p>
  «Но как переиспользовать стили?» — через компоненты фреймворка, а не CSS-классы. В React, Vue, Svelte вы создаёте компоненты — и стили инкапсулируются в них.
</p>

<pre><code>// Button.tsx — стили живут в компоненте
const variants = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  ghost: 'text-gray-600 hover:bg-gray-50',
};

export function Button({ variant = 'primary', children, ...props }) {
  return (
    &lt;button
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-4 py-2',
        'font-medium text-sm transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-brand-500/40',
        variants[variant]
      )}
      {...props}
    &gt;
      {children}
    &lt;/button&gt;
  );
}</code></pre>

<h2 id="responsive">Адаптивная вёрстка</h2>

<p>
  Tailwind использует mobile-first breakpoints. Пишете стили для мобильных, затем добавляете модификаторы для больших экранов:
</p>

<pre><code>&lt;div className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
"&gt;
  {cards.map(card =&gt; &lt;Card key={card.id} {...card} /&gt;)}
&lt;/div&gt;</code></pre>

<p>Breakpoints по умолчанию:</p>

<table>
  <thead>
    <tr>
      <th>Prefix</th>
      <th>Min-width</th>
      <th>Описание</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>sm</td><td>640px</td><td>Крупные телефоны</td></tr>
    <tr><td>md</td><td>768px</td><td>Планшеты</td></tr>
    <tr><td>lg</td><td>1024px</td><td>Ноутбуки</td></tr>
    <tr><td>xl</td><td>1280px</td><td>Десктопы</td></tr>
    <tr><td>2xl</td><td>1536px</td><td>Широкие экраны</td></tr>
  </tbody>
</table>

<h2 id="dark-mode">Тёмная тема</h2>

<p>
  Tailwind поддерживает dark mode из коробки через модификатор <code>dark:</code>. Достаточно добавить <code>darkMode: 'class'</code> в конфиг и переключать класс <code>dark</code> на <code>&lt;html&gt;</code>.
</p>

<pre><code>&lt;div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"&gt;
  &lt;h1 className="text-2xl font-bold"&gt;Заголовок&lt;/h1&gt;
  &lt;p className="text-gray-600 dark:text-gray-400"&gt;Текст&lt;/p&gt;
&lt;/div&gt;</code></pre>

<h2 id="performance">Производительность</h2>

<p>
  Tailwind v4 генерирует только используемые утилиты. Типичный production CSS для крупного проекта — <strong>8–15 KB gzipped</strong>. Для сравнения, Bootstrap — 25+ KB, а кастомный CSS крупного проекта легко достигает 100+ KB.
</p>

<h2 id="conclusion">Заключение</h2>

<p>
  Tailwind — не серебряная пуля, но лучший инструмент для команд, которые ценят скорость и предсказуемость. Utility-first убирает слой абстракции между дизайном и кодом, а конфигурация через <code>tailwind.config.ts</code> гарантирует консистентность дизайн-системы.
</p>
""".strip()

TAILWIND_TOC = [
    {"id": "intro", "text": "Введение", "level": 2, "enabled": True},
    {"id": "why-utility", "text": "Почему Utility-first", "level": 2, "enabled": True},
    {"id": "config", "text": "Конфигурация", "level": 2, "enabled": True},
    {"id": "components", "text": "Компонентный подход", "level": 2, "enabled": True},
    {"id": "responsive", "text": "Адаптивная вёрстка", "level": 2, "enabled": True},
    {"id": "dark-mode", "text": "Тёмная тема", "level": 2, "enabled": True},
    {"id": "performance", "text": "Производительность", "level": 2, "enabled": True},
    {"id": "conclusion", "text": "Заключение", "level": 2, "enabled": True},
]

TAILWIND_ARTIFACTS = {
    "selfCheck": {
        "enabled": True,
        "items": [
            {"id": "1", "question": "Почему utility-first лучше BEM для больших проектов?", "answer": "Нет конфликтов имён, нет мёртвого CSS, нет протекающих абстракций."},
            {"id": "2", "question": "Какой размер production CSS у Tailwind?", "answer": "8–15 KB gzipped — в разы меньше Bootstrap и кастомного CSS."},
        ],
    },
    "sources": {
        "enabled": True,
        "items": [
            {"id": "1", "title": "Tailwind CSS — официальная документация", "url": "https://tailwindcss.com/docs", "type": "documentation"},
            {"id": "2", "title": "CSS Utility Classes and \"Separation of Concerns\" — Adam Wathan", "url": "https://adamwathan.me/css-utility-classes-and-separation-of-concerns/", "type": "article"},
        ],
    },
    "glossary": {"enabled": False, "items": []},
    "provenance": {"enabled": False, "workspaceId": "", "showLink": False},
}


# ---------------------------------------------------------------------------
# Rich content: CSS Grid (для one-column-article) — three-column
# ---------------------------------------------------------------------------
CSS_GRID_CONTENT = """
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
  CSS Grid Layout — это система двумерного размещения элементов. Вы определяете сетку из строк и колонок, а затем размещаете элементы в ячейках этой сетки.
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

<h3 id="grid-template">Grid Template Areas</h3>

<p>
  Именованные области позволяют описать раскладку визуально:
</p>

<pre><code>.page {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "toc     content sidebar"
    "footer  footer  footer";
  grid-template-columns: 200px 1fr 280px;
}</code></pre>

<h3 id="grid-responsive">Адаптивный Grid</h3>

<pre><code>.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}</code></pre>

<h2 id="flexbox-basics">Flexbox: когда и зачем</h2>

<p>
  Flexbox — одномерная система раскладки. Идеален для навигации, тулбаров, карточек и центрирования.
</p>

<pre><code>.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar__spacer {
  flex: 1;
}</code></pre>

<h2 id="grid-vs-flexbox">Grid vs Flexbox: что выбрать</h2>

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
      <td>Двумерная</td>
      <td>Одномерная</td>
    </tr>
    <tr>
      <td>Подход</td>
      <td>Layout-first</td>
      <td>Content-first</td>
    </tr>
    <tr>
      <td>Лучше для</td>
      <td>Макет страницы, сетки</td>
      <td>Компоненты, навигация</td>
    </tr>
  </tbody>
</table>

<h2 id="conclusion">Заключение</h2>

<p>
  CSS Grid и Flexbox — партнёры. Grid для макроструктуры, Flexbox для микрокомпонентов. Вместе покрывают любую задачу вёрстки.
</p>
""".strip()

CSS_GRID_TOC = [
    {"id": "intro", "text": "Введение", "level": 2, "enabled": True},
    {"id": "grid-basics", "text": "CSS Grid: основы", "level": 2, "enabled": True},
    {"id": "grid-template", "text": "Grid Template Areas", "level": 3, "enabled": True},
    {"id": "grid-responsive", "text": "Адаптивный Grid", "level": 3, "enabled": True},
    {"id": "flexbox-basics", "text": "Flexbox: когда и зачем", "level": 2, "enabled": True},
    {"id": "grid-vs-flexbox", "text": "Grid vs Flexbox: что выбрать", "level": 2, "enabled": True},
    {"id": "conclusion", "text": "Заключение", "level": 2, "enabled": True},
]

CSS_GRID_ARTIFACTS = {
    "selfCheck": {
        "enabled": True,
        "items": [
            {"id": "1", "question": "В чём различие Grid и Flexbox?", "answer": "Grid — двумерная система, Flexbox — одномерная."},
            {"id": "2", "question": "Зачем нужны явные grid-column привязки?", "answer": "Без них auto-placement может поместить контент не в ту колонку при отсутствии элемента в DOM."},
        ],
    },
    "sources": {
        "enabled": True,
        "items": [
            {"id": "1", "title": "CSS Grid Layout — MDN", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout", "type": "documentation"},
            {"id": "2", "title": "A Complete Guide to CSS Grid — CSS-Tricks", "url": "https://css-tricks.com/snippets/css/complete-guide-grid/", "type": "article"},
        ],
    },
    "glossary": {"enabled": False, "items": []},
    "provenance": {"enabled": False, "workspaceId": "", "showLink": False},
}


# ---------------------------------------------------------------------------
# Базовый контент-генератор для остальных статей
# ---------------------------------------------------------------------------
def make_basic_content(title: str, subtitle: str, summary: str) -> str:
    """Генерирует базовый HTML-контент из метаданных статьи."""
    # Remove HTML from summary
    clean_summary = summary.replace("<p>", "").replace("</p>", "").strip()
    return f"""
<h2 id="intro">Введение</h2>

<p>
  {clean_summary}
</p>

<p>
  {subtitle}. В этой статье разберём ключевые аспекты и практические рекомендации, которые помогут вам сразу приступить к реализации.
</p>

<h2 id="overview">Обзор</h2>

<p>
  Тема «{title}» становится всё более актуальной в 2025–2026 годах. Рынок меняется быстро, и те, кто адаптируется раньше, получают значительное преимущество.
</p>

<p>
  Ключевые тренды:
</p>

<ul>
  <li><strong>Автоматизация</strong> — рутинные задачи всё чаще делегируются ИИ и инструментам</li>
  <li><strong>Персонализация</strong> — один подход для всех больше не работает</li>
  <li><strong>Измеримость</strong> — каждое решение должно подкрепляться данными</li>
</ul>

<h2 id="practice">Практика</h2>

<p>
  На практике важно начинать с малого: выбрать одну конкретную задачу, протестировать подход на ограниченной аудитории, замерить результат и только потом масштабировать.
</p>

<blockquote>
  <p><strong>Совет:</strong> Не пытайтесь внедрить всё сразу. Итеративный подход работает лучше, чем попытка «большого запуска».</p>
</blockquote>

<h2 id="conclusion">Заключение</h2>

<p>
  {title} — это не просто тренд, а фундаментальный сдвиг в подходе к работе. Начните с одного конкретного шага сегодня, и через месяц вы увидите первые результаты.
</p>
""".strip()


# ---------------------------------------------------------------------------
# Конфигурация обновлений
# ---------------------------------------------------------------------------
RICH_ARTICLES: dict[str, dict] = {
    # slug → {content, toc, artifacts, layout}
    "youtube-monetization-guide": {  # «Психоинженерия»
        "content": PSYCHO_CONTENT,
        "toc": PSYCHO_TOC,
        "artifacts": PSYCHO_ARTIFACTS,
        "layout": ArticleLayout.THREE_COLUMN,
    },
    "figma-web-designers": {  # «Figma для веб-дизайнеров»
        "content": FIGMA_CONTENT,
        "toc": FIGMA_TOC,
        "artifacts": FIGMA_ARTIFACTS,
        "layout": ArticleLayout.TWO_COLUMN,
    },
    "email-marketing-growth": {  # «Email-маркетинг»
        "content": EMAIL_CONTENT,
        "toc": EMAIL_TOC,
        "artifacts": EMAIL_ARTIFACTS,
        "layout": ArticleLayout.ONE_COLUMN,
    },
    "tailwind-css-fast-development": {  # «Tailwind CSS»
        "content": TAILWIND_CONTENT,
        "toc": TAILWIND_TOC,
        "artifacts": TAILWIND_ARTIFACTS,
        "layout": ArticleLayout.FULL_WIDTH,
    },
    "one-column-article": {  # «CSS Grid и Flexbox» (demo-page)
        "content": CSS_GRID_CONTENT,
        "toc": CSS_GRID_TOC,
        "artifacts": CSS_GRID_ARTIFACTS,
        "layout": ArticleLayout.THREE_COLUMN,
    },
}


def enrich(db: Session) -> None:
    articles = db.query(Article).all()
    updated_rich = 0
    updated_basic = 0

    for art in articles:
        if art.slug in RICH_ARTICLES:
            data = RICH_ARTICLES[art.slug]
            art.content = data["content"]
            art.toc = data["toc"]
            art.artifacts = data["artifacts"]
            art.layout = data["layout"]
            updated_rich += 1
        elif not art.content or art.content.strip() == "":
            art.content = make_basic_content(
                art.title,
                art.subtitle or "",
                art.summary or f"<p>{art.title}</p>",
            )
            updated_basic += 1

    db.commit()
    print(
        f"Enriched: {updated_rich} rich articles, "
        f"{updated_basic} basic articles, "
        f"{len(articles)} total in DB"
    )


def main() -> None:
    db = SessionLocal()
    try:
        enrich(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
