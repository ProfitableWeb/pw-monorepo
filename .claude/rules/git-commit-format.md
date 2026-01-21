# Формат Git коммитов

Формат: `type(PW-XXXX): subject`

- Номер задачи: `PW-001`, `PW-011` - должен существовать в `docs/tasks/`
- Типы: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`
- Описание: повелительное наклонение, строчные буквы
- **НЕ добавлять** `Co-Authored-By: Claude <noreply@anthropic.com>` в коммиты

Примеры:

- ✅ `feat(PW-011): рефакторинг и оптимизация`
- ❌ `PW-011: optimize` (неверный формат)
- ❌ `feat: add component` (отсутствует номер задачи)
- ❌ `feat(PW-011): add component\n\nCo-Authored-By: Claude` (НЕ добавлять соавторство)
