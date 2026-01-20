#!/bin/bash
set -e

# ============================================
# Скрипт обновления nginx конфига на Cloud.ru
# ============================================

echo "🔧 Обновление nginx конфига для ProfitableWeb..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка что скрипт запускается из корня репозитория
if [ ! -f "ecosystem.config.js" ]; then
    echo -e "${RED}❌ Скрипт должен запускаться из корня репозитория${NC}"
    exit 1
fi

# Проверка наличия нового конфига
if [ ! -f "docs/nginx/profitableweb.conf" ]; then
    echo -e "${RED}❌ Конфиг docs/nginx/profitableweb.conf не найден${NC}"
    exit 1
fi

# Создать резервную копию текущего конфига
echo -e "${YELLOW}📦 Создание резервной копии текущего конфига...${NC}"
sudo cp /etc/nginx/sites-available/profitableweb \
     /etc/nginx/sites-available/profitableweb.backup.$(date +%Y%m%d_%H%M%S)

# Копировать новый конфиг
echo -e "${YELLOW}📝 Установка нового конфига...${NC}"
sudo cp docs/nginx/profitableweb.conf /etc/nginx/sites-available/profitableweb

# Проверить синтаксис
echo -e "${YELLOW}🔍 Проверка синтаксиса nginx...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✅ Синтаксис корректный${NC}"
else
    echo -e "${RED}❌ Ошибка в синтаксисе конфига${NC}"
    echo -e "${YELLOW}⚠️  Восстановление из резервной копии...${NC}"
    sudo cp /etc/nginx/sites-available/profitableweb.backup.$(date +%Y%m%d_%H%M%S) \
         /etc/nginx/sites-available/profitableweb
    exit 1
fi

# Перезапустить nginx
echo -e "${YELLOW}🔄 Перезапуск nginx...${NC}"
sudo systemctl reload nginx

# Проверить статус
if sudo systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx успешно перезапущен${NC}"
else
    echo -e "${RED}❌ Nginx не запустился${NC}"
    sudo systemctl status nginx
    exit 1
fi

# Проверить что Next.js работает
echo -e "${YELLOW}🔍 Проверка Next.js...${NC}"
if curl -s http://127.0.0.1:3000/ > /dev/null; then
    echo -e "${GREEN}✅ Next.js отвечает на порту 3000${NC}"
else
    echo -e "${RED}❌ Next.js не отвечает на порту 3000${NC}"
    echo -e "${YELLOW}Попробуйте: pm2 restart web${NC}"
fi

# Проверить через nginx
echo -e "${YELLOW}🔍 Проверка через nginx...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Nginx корректно проксирует на Next.js (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  Nginx вернул HTTP код: $HTTP_CODE${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Готово!${NC}"
echo ""
echo "Проверьте в браузере:"
echo "  - http://213.171.25.187/"
echo "  - http://profitableweb.ru/"
echo ""
echo "Посмотреть логи nginx:"
echo "  sudo tail -f /var/log/nginx/profitableweb_error.log"
echo ""
echo "Посмотреть логи Next.js:"
echo "  pm2 logs web"
