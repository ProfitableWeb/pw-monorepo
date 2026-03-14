# Зеркало зависимостей (dependency mirror)

Краткий обзор: зачем нужно своё зеркало и как его поднять для Node (Bun/npm) и Python в этом проекте.

## Зачем

- **Резерв**: npm/PyPI недоступны — сборка идёт из локального/корпоративного зеркала.
- **Скорость**: один раз скачали — все берут из кэша (особенно в CI и на сервере).
- **Политика**: только разрешённые пакеты, аудит, приватные артефакты.

## Национальные зеркала (в т.ч. GitVerse)

У **GitVerse** (где у проекта основной репозиторий) есть свои зеркала реестров — российские, быстрее и стабильнее при
проблемах с доступом к зарубежным сервисам:

| Реестр         | Зеркало GitVerse                                                                      | Статус |
| -------------- | ------------------------------------------------------------------------------------- | ------ |
| **npm**        | `https://npm-mirror.gitverse.ru`                                                      | Beta   |
| **Docker Hub** | `https://dh-mirror.gitverse.ru`                                                       | Есть   |
| **Maven**      | см. [документацию](https://gitverse.ru/docs/artifactory/registry-mirrors/mvn-mirror/) | Есть   |

**PyPI** в списке зеркал GitVerse нет — для Python по-прежнему либо свой прокси (devpi и т.п.), либо публичный PyPI.

Подключение **npm-зеркала GitVerse** в этом проекте:

```ini
# .npmrc в корне или через переменную
registry=https://npm-mirror.gitverse.ru
```

Или разово: `bun install --registry=https://npm-mirror.gitverse.ru`.  
Документация: [GitVerse — зеркало NPM](https://gitverse.ru/docs/artifactory/registry-mirrors/npm-mirror/).

Для **Docker** (образы в CI/деплое): настройка
[зеркала Docker Hub](https://gitverse.ru/docs/artifactory/registry-mirrors/dh-mirror/) в Docker/Podman.

Другие российские зеркала: например, [packagist.org.ru](https://packagist.org.ru/) — для PHP/Composer. Универсального
государственного или единого национального зеркала для всех реестров нет, сервисы разрознены (GitVerse, вузы,
коммерческие CDN).

## Варианты по стеку

### Node (Bun / npm)

В проекте используется **Bun** (`packageManager: "bun@1.2.17"`). Регистри можно переопределить через `.npmrc`.

| Решение                 | Роль                                                    | Сложность |
| ----------------------- | ------------------------------------------------------- | --------- |
| **Verdaccio**           | Прокси-зеркало npm (кэш + при желании приватные пакеты) | Низкая    |
| **GitHub Packages**     | Регистри npm, если всё уже в GitHub                     | Средняя   |
| **Nexus / Artifactory** | Универсальный артефакт-сервер (npm + PyPI + др.)        | Высокая   |

Минимальный вариант — Verdaccio в Docker как прокси к registry.npmjs.org: первый запрос тянет с npm, дальше отдаёт из
кэша.

**Настройка проекта под своё зеркало** — в корне монорепо или в `apps/*` создаётся/правится `.npmrc`:

```ini
# Использовать своё зеркало вместо registry.npmjs.org
registry=https://npm.your-domain.ru/
# или только для CI
# registry=${NPM_REGISTRY:-https://registry.npmjs.org/}
```

Bun и npm этот файл подхватывают. В CI переменную `NPM_REGISTRY` можно задавать под окружение (например, зеркало только
на сервере).

### Python (API, pyproject.toml)

Зависимости ставятся через `uv` или `pip` из PyPI.

| Решение                         | Роль                                          | Сложность             |
| ------------------------------- | --------------------------------------------- | --------------------- |
| **devpi**                       | Зеркало/кэш PyPI + приватный индекс           | Средняя               |
| **bandersnatch**                | Официальный инструмент полного зеркала PyPI   | Высокая (много места) |
| **Nexus / Artifactory**         | Прокси PyPI в составе общего артефакт-сервера | Высокая               |
| **pip download + --find-links** | Локальная папка с wheel/sdist, без сервера    | Низкая                |

Для «своего зеркала» в смысле кэша/резерва обычно достаточно **прокси PyPI** (devpi или Nexus). Полное зеркало
(bandersnatch) имеет смысл только при жёстких ограничениях по сети/безопасности.

**Настройка проекта** — переменные окружения или конфиг pip:

```bash
# Один раз указать свой индекс (зеркало)
export PIP_INDEX_URL=https://pypi.your-domain.ru/simple/
pip install -e .
# или в CI
PIP_INDEX_URL=${PIP_INDEX_URL:-https://pypi.org/simple} pip install -e .
```

В `pyproject.toml` свой индекс не прописывают — это делают через окружение или `pip.conf`, чтобы не завязывать
репозиторий на конкретный URL.

## Контекст проекта: без Docker

В этом проекте **CI и деплой идут без Docker**: GitHub Actions по SSH заходит на VM, там выполняются `bun install`,
`uv sync`, сборки и запуск через PM2 (см.
[deploy-gitverse-only.yml](https://github.com/ProfitableWeb/pw-monorepo/blob/master/.github/workflows/deploy-gitverse-only.yml)).
Поэтому «своё зеркало» на той же VM логично поднимать тоже без контейнеров — через установку сервиса (Verdaccio, devpi)
напрямую или через **зеркало GitVerse** и не поднимать своё.

## Минимальный старт: своё npm-зеркало

**Вариант А — без своего зеркала (рекомендуется здесь):** использовать зеркало GitVerse: в корне репозитория или на VM
перед `bun install` задать `registry=https://npm-mirror.gitverse.ru` (через `.npmrc` или `NPM_CONFIG_REGISTRY`). Docker
и отдельный сервис не нужны.

**Вариант Б — Verdaccio на VM без Docker:**

1. На VM установить Node (достаточно для запуска Verdaccio): `npx verdaccio` или глобально
   `npm i -g verdaccio && verdaccio`.
2. Запускать как сервис (systemd): unit с `ExecStart=npx verdaccio` или `ExecStart=/path/to/node/bin/verdaccio`,
   порт 4873.
3. В пайплайне или на VM перед `bun install`: `export NPM_CONFIG_REGISTRY=http://localhost:4873/` (если Verdaccio на той
   же машине) или `http://your-vm:4873/`.

**Вариант В — Verdaccio в Docker** (если позже появится Docker на VM или отдельном хосте):

```bash
docker run -d --name verdaccio -p 4873:4873 -v verdaccio-storage:/verdaccio/storage verdaccio/verdaccio
```

Документация Verdaccio: [verdaccio.org](https://verdaccio.org/docs/what-is-verdaccio).

## Резюме

- **Национальные зеркала есть**: у GitVerse — npm и Docker Hub (см. таблицу выше); для npm в этом проекте можно сразу
  использовать `registry=https://npm-mirror.gitverse.ru`.
- **Своё зеркало зависимостей тоже можно поднять**: для Node — Verdaccio, для Python — devpi или Nexus/Artifactory.
- Проект совместим с любым зеркалом: достаточно задать `registry` (Node) и `PIP_INDEX_URL` (Python), не меняя
  lock-файлы.
- Полное зеркало всего PyPI (bandersnatch) нужно только для изолированных сред; у GitVerse зеркала PyPI нет.

При необходимости можно оформить отдельный runbook под вашу VM (как в [runbooks/deploy.md](../runbooks/deploy.md)):
установка Verdaccio/devpi, systemd, nginx перед ним и пример `.env` для CI.
