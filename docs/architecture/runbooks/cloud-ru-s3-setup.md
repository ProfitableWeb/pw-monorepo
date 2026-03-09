# Настройка Cloud.ru Object Storage (S3)

Руководство по настройке Cloud.ru Evolution Object Storage для хранения медиафайлов.

## Предварительные требования

- Аккаунт Cloud.ru с подключённым Object Storage
- Бакет создан (например, `pw-media`)
- Сгенерированы access key + secret key в панели Object Storage API

## 1. Получение параметров

В панели Cloud.ru → Object Storage → Object Storage API:

| Параметр         | Пример                                 |
| ---------------- | -------------------------------------- |
| Endpoint         | `https://s3.cloud.ru/pw-media`         |
| ID тенанта       | `2095a86e-3589-4ab0-a898-239e85b83a0f` |
| Регион           | `ru-central-1`                         |
| Название сервиса | `s3`                                   |
| Access key ID    | `ae45fb57521aa983027d0c94f4f40f18`     |
| Secret key       | (скрыт)                                |

## 2. Формат access key

**Критически важно**: Cloud.ru требует access key в формате `<tenant_id>:<key_id>`.

```
# Неправильно (InvalidAccessKeyId):
S3_ACCESS_KEY=ae45fb57521aa983027d0c94f4f40f18

# Правильно (~69 символов):
S3_ACCESS_KEY=2095a86e-3589-4ab0-a898-239e85b83a0f:ae45fb57521aa983027d0c94f4f40f18
```

Tenant ID берётся из панели Object Storage API (поле "ID тенанта").

## 3. Модели адресации бакетов

Cloud.ru поддерживает три модели URL:

| Модель | URL формат                                  | Авторизованный | Анонимный |
| ------ | ------------------------------------------- | -------------- | --------- |
| Basic  | `https://s3.cloud.ru/{bucket}/{key}`        | ✅             | ❌        |
| Global | `https://global.s3.cloud.ru/{bucket}/{key}` | ✅             | ✅        |
| DNS    | `https://{dns-name}.s3.cloud.ru/{key}`      | ✅             | ✅        |

**Для публичного доступа к файлам** (отображение изображений в браузере) необходимо использовать Global или DNS
endpoint. Basic endpoint (s3.cloud.ru) при анонимном доступе возвращает `400 Bad Request` с ошибкой
`AuthorizationQueryParametersError: missing tenant id`.

Поэтому в проекте два эндпоинта:

- `S3_ENDPOINT=https://s3.cloud.ru` — для boto3 API-вызовов (put_object, delete_object, head_object)
- `S3_PUBLIC_ENDPOINT=https://global.s3.cloud.ru` — для публичных URL изображений в браузере

## 4. Bucket policy для публичного чтения

Чтобы файлы были доступны анонимно через Global endpoint, нужно установить bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::pw-media/*"
    }
  ]
}
```

Установка через boto3:

```python
import json, boto3

client = boto3.client("s3", endpoint_url="https://s3.cloud.ru", ...)
client.put_bucket_policy(
    Bucket="pw-media",
    Policy=json.dumps(policy)
)
```

**Примечание**: Object-level ACL (`get_object_acl`) на Cloud.ru **не реализован** (`NotImplemented`). Публичный доступ
настраивается только через bucket policy.

## 5. Переменные окружения

### Локальный `.env` (apps/api/.env)

```env
STORAGE_BACKEND=s3
S3_ENDPOINT=https://s3.cloud.ru
S3_PUBLIC_ENDPOINT=https://global.s3.cloud.ru
S3_BUCKET=pw-media
S3_ACCESS_KEY=<tenant_id>:<key_id>
S3_SECRET_KEY=<secret_key>
S3_REGION=ru-central-1
```

### GitVerse секреты

Те же 7 переменных добавляются как секреты в GitVerse → Settings → Secrets. CI/CD workflow автоматически прокидывает их
на сервер при деплое.

## 6. Проверка соединения

Тест-скрипт (`apps/api/test_s3.py`):

```python
import sys
sys.path.insert(0, ".")
from src.core.config import settings
import boto3

client = boto3.client(
    "s3",
    endpoint_url=settings.s3_endpoint,
    aws_access_key_id=settings.s3_access_key,
    aws_secret_access_key=settings.s3_secret_key,
    region_name=settings.s3_region,
)

# 1. Аутентификация
resp = client.list_buckets()
print(f"Buckets: {[b['Name'] for b in resp['Buckets']]}")

# 2. Доступ к бакету
client.head_bucket(Bucket=settings.s3_bucket)

# 3. Запись
client.put_object(Bucket=settings.s3_bucket, Key="test.txt", Body=b"test")

# 4. Чтение
client.head_object(Bucket=settings.s3_bucket, Key="test.txt")

# 5. Удаление
client.delete_object(Bucket=settings.s3_bucket, Key="test.txt")

print("ALL TESTS PASSED")
```

```bash
cd apps/api && uv run python test_s3.py
```

## 7. Типичные ошибки

| Ошибка                             | Причина                                   | Решение                                             |
| ---------------------------------- | ----------------------------------------- | --------------------------------------------------- |
| `InvalidAccessKeyId`               | Access key без tenant_id                  | Формат: `tenant_id:key_id`                          |
| `missing tenant id` (400)          | Анонимный доступ через basic endpoint     | Использовать `global.s3.cloud.ru`                   |
| `NoSuchBucket` на DNS URL          | Virtual-hosted style с basic name         | Настроить DNS name в панели или использовать Global |
| `NotImplemented` на GetObjectAcl   | Cloud.ru не поддерживает object-level ACL | Использовать bucket policy                          |
| Изображения не грузятся в браузере | Нет bucket policy или basic endpoint      | Установить policy + `S3_PUBLIC_ENDPOINT`            |

## Связанные файлы

- `apps/api/src/core/config.py` — настройки S3 (7 полей)
- `apps/api/src/services/storage.py` — S3Storage (boto3)
- `.github/workflows/deploy-gitverse-only.yml` — прокидывание секретов на сервер
- `docs/architecture/decisions/ADR-003-file-storage.md` — архитектурное решение
