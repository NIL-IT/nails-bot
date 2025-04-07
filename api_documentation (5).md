# 📘 API Документация

### 🛠 Назначение:
API работает с двумя типами сущностей:
- `category` — категории/разделы каталога/структура каталога.
- `item` — отдельные товары.

Запросы принимаются через `POST`, данные должны быть в JSON-формате. Ответы возвращаются также в JSON.

---

## 🔗 Endpoint:
```
POST https://nails.nilit2.ru:8000/catalog.php
```

---

## 📝 Request Format (тело запроса)

```json
{
  "type": "category" | "item" | "catalog",
  "id": number | "NULL"
}
```

| Поле | Тип | Обязательное | Описание |
|------|-----|---------------|----------|
| `type` | string | ✅ | Определяет, какую сущность запрашиваем: `category`, `item` или `catalog` |
| `id` | number или строка `"NULL"` | ✅ | ID категории или товара. `"NULL"` используется для запроса корневых категорий |

---

## 🔄 Обработка по `type`:

### 🔹 type = `"category"`

#### Вариант 1: `"id": "NULL"`
- Возвращает список категорий, у которых `id_parent IS NULL` (корневые разделы).

#### Вариант 2: `"id": число`
- Сначала ищет подразделы с `id_parent = id`.
- Если таких нет — возвращает **id товаров**, у которых `id_section = id`.

---

### 🔸 type = `"item"`

- Возвращает полную информацию о товаре по его `id`.

---

### 🔸 type = `"catalog"` , `"id": "NULL"`

- Возвращает структуру каталогов.

---

## 📤 Response Format

### ✅ Успешный ответ:
```json
{
  "data": [ /* массив объектов */ ]
}
```

### ❌ Ошибка валидации:
```json
{
  "error": "Missing type or id"
}
```

### ❌ Неверный тип:
```json
{
  "error": "Invalid type"
}
```

### ❌ Неверный ID:
```json
{
  "error": "Invalid id"
}
```

### ❌ Ошибка выполнения запроса (не JSON!):
```text
query error
```
> ⚠️ *Обрати внимание: в случае ошибки SQL вместо JSON может быть просто текст `query error`, что может сломать парсинг на клиенте.*

---

## 📌 Примеры запросов

### ▶ Получить корневые категории
```http
POST /catalog.php
Content-Type: application/json

{
  "type": "category",
  "id": "NULL"
}
```

### ▶ Получить подкатегории категории с id = 5
```http
POST /catalog.php
Content-Type: application/json

{
  "type": "category",
  "id": 5
}
```

### ▶ Получить товар с id = 10
```http
POST /catalog.php
Content-Type: application/json

{
  "type": "item",
  "id": 10
}
```

### ▶ Получить структуру каталога
```http
POST /catalog.php
Content-Type: application/json

{
  "type": "catalog",
  "id": NULL
}
```

---
### 🛠 Назначение:
API работает с параметрами:
- `type` — поиск по списку продуктов.
- `search` — подстрока.

Запросы принимаются через `POST`, данные должны быть в JSON-формате. Ответы возвращаются также в JSON.

## 🔍 Поиск товаров

### 🔗 Endpoint:
```
POST https://nails.nilit2.ru:8000/search.php
```

---

### 📝 Request Format (тело запроса)

```json
{
  "type": "product_list",
  "search": "подстрока"
}
```

| Поле | Тип | Обязательное | Описание |
|------|-----|---------------|----------|
| `type` | string | ✅ | Должно быть строго `"product_list"` |
| `search` | string | ✅ | Подстрока для поиска товаров по названию |

---

### 🔄 Описание работы

- Производится поиск по имени товаров, содержащих указанную подстроку `search`.
- Возвращаются товары, в имени которых присутствует заданная строка.

---

### 📤 Response Format

#### ✅ Успешный ответ:
```json
{
  "data": [ /* массив найденных товаров */ ]
}
```

#### ❌ Ошибки:
```json
{
  "error": "Missing type or search parameters"
}
```

```json
{
  "error": "Invalid type"
}
```

---

### 📌 Пример запроса

```http
POST /search.php
Content-Type: application/json

{
  "type": "product_list",
  "search": "гель"
}
```

---

## ⚠️ Примечания

- 🧪 **Обработка ошибок**: строка `query error` не оформлена как JSON — это может вызвать сбой на клиенте.
