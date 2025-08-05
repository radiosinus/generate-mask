# 🎨 Generate Mask API

Мини-сервис для генерации PNG-масок для DALL·E (или другого inpainting API).

## 📦 Что делает

Создаёт квадратную маску, где:
- по центру белый прямоугольник `width × height`
- фон — чёрный
- итоговое изображение: `targetSize × targetSize`

## 🚀 Как задеплоить на Render

1. Залогинься на [https://render.com](https://render.com)
2. Создай новый Web Service
3. Подключи репозиторий с этим кодом
4. Укажи:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Через 30–60 сек сервис будет доступен по URL вида:
   ```
   https://generate-mask.onrender.com/generate-mask
   ```

## 📡 Пример запроса

```bash
curl -X POST https://your-service.onrender.com/generate-mask \
  -H "Content-Type: application/json" \
  -d '{ "width": 1280, "height": 1153, "targetSize": 1280 }' \
  --output mask.png
```
