#!/bin/bash

# ============================================================================
# Скрипт настройки Claude Code для работы с GLM моделями через z.ai
#
# Назначение:
#   Автоматически настраивает Claude Code для использования GLM моделей
#   (GLM-4.7, GLM-4.6, GLM-4.5) вместо стандартных моделей Anthropic.
#   Настраивает переменные окружения и конфигурацию для работы с
#   GLM Coding Plan от z.ai.
#
# Что делает:
#   1. Проверяет и устанавливает Node.js (если нужно)
#   2. Устанавливает Claude Code глобально
#   3. Настраивает ~/.claude/settings.json с API ключом от z.ai (глобально)
#   4. Конфигурирует endpoint для работы с GLM моделями
#
# Использование:
#   bash claude_code_zai_env.sh
#
# Варианты настройки:
#   1. Глобальная настройка (~/.claude/settings.json):
#      - Применяется ко ВСЕМ проектам
#      - Используется по умолчанию, если нет локальных настроек
#
#   2. Локальная настройка проекта (.claude/settings.json):
#      - Создайте .claude/settings.json в корне проекта
#      - Переопределяет глобальные настройки только для этого проекта
#      - Можно коммитить в git (для командных стандартов)
#      - Пример: один проект с GLM, другой с Anthropic API
#
#   3. Локальная настройка (личная) (.claude/settings.local.json):
#      - Не коммитится в git (автоматически игнорируется)
#      - Для личных экспериментов и переопределений
#
# Приоритет настроек (от высшего к низшему):
#   1. .claude/settings.local.json (проект, личное)
#   2. .claude/settings.json (проект, общее)
#   3. ~/.claude/settings.json (глобальное)
#
# Документация:
#   https://docs.z.ai/scenario-example/develop-tools/claude
#   https://docs.z.ai/devpack/quick-start
#   https://docs.anthropic.com/en/docs/claude-code/settings
#
# Альтернативный способ (автоматическая установка):
#   curl -O "https://cdn.bigmodel.cn/install/claude_code_zai_env.sh" && bash ./claude_code_zai_env.sh
#
# Возврат к API Anthropic:
#   Вариант 1 (для конкретного проекта):
#     Создайте .claude/settings.json в проекте с:
#     {
#       "env": {
#         "ANTHROPIC_API_KEY": "your_anthropic_api_key"
#       }
#     }
#     Это переопределит глобальные настройки только для этого проекта.
#
#   Вариант 2 (глобально для всех проектов):
#     1. Удалите или переименуйте ~/.claude/settings.json
#     2. Запустите Claude Code: claude
#     3. Выберите вариант входа через Anthropic (Claude account или Console account)
#     4. Либо создайте новый ~/.claude/settings.json с:
#        {
#          "env": {
#            "ANTHROPIC_API_KEY": "your_anthropic_api_key"
#          }
#        }
#   Документация Anthropic: https://docs.anthropic.com/claude/docs/claude-code
# ============================================================================

set -euo pipefail

# ========================
#       Define Constants
# ========================
SCRIPT_NAME=$(basename "$0")
NODE_MIN_VERSION=18
NODE_INSTALL_VERSION=22
NVM_VERSION="v0.40.3"
CLAUDE_PACKAGE="@anthropic-ai/claude-code"
CONFIG_DIR="$HOME/.claude"
CONFIG_FILE="$CONFIG_DIR/settings.json"
API_BASE_URL="https://api.z.ai/api/anthropic"
API_KEY_URL="https://z.ai/manage-apikey/apikey-list"
API_TIMEOUT_MS=3000000

# ========================
#       Functions
# ========================

log_info() {
    echo "🔹 $*"
}

log_success() {
    echo "✅ $*"
}

log_error() {
    echo "❌ $*" >&2
}

ensure_dir_exists() {
    local dir="$1"
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir" || {
            log_error "Failed to create directory: $dir"
            exit 1
        }
    fi
}

# ========================
#     Node.js Installation
# ========================

install_nodejs() {
    local platform=$(uname -s)

    case "$platform" in
        Linux|Darwin)
            log_info "Installing Node.js on $platform..."

            # Install nvm
            log_info "Installing nvm ($NVM_VERSION)..."
            curl -s https://raw.githubusercontent.com/nvm-sh/nvm/"$NVM_VERSION"/install.sh | bash

            # Load nvm
            log_info "Loading nvm environment..."
            \. "$HOME/.nvm/nvm.sh"

            # Install Node.js
            log_info "Installing Node.js $NODE_INSTALL_VERSION..."
            nvm install "$NODE_INSTALL_VERSION"

            # Verify installation
            node -v &>/dev/null || {
                log_error "Node.js installation failed"
                exit 1
            }
            log_success "Node.js installed: $(node -v)"
            log_success "npm version: $(npm -v)"
            ;;
        *)
            log_error "Unsupported platform: $platform"
            exit 1
            ;;
    esac
}

# ========================
#     Node.js Check
# ========================

check_nodejs() {
    if command -v node &>/dev/null; then
        current_version=$(node -v | sed 's/v//')
        major_version=$(echo "$current_version" | cut -d. -f1)

        if [ "$major_version" -ge "$NODE_MIN_VERSION" ]; then
            log_success "Node.js is already installed: v$current_version"
            return 0
        else
            log_info "Node.js v$current_version is installed but version < $NODE_MIN_VERSION. Upgrading..."
            install_nodejs
        fi
    else
        log_info "Node.js not found. Installing..."
        install_nodejs
    fi
}

# ========================
#     Claude Code Installation
# ========================

install_claude_code() {
    if command -v claude &>/dev/null; then
        log_success "Claude Code is already installed: $(claude --version)"
    else
        log_info "Installing Claude Code..."
        npm install -g "$CLAUDE_PACKAGE" || {
            log_error "Failed to install claude-code"
            exit 1
        }
        log_success "Claude Code installed successfully"
    fi
}

configure_claude_json(){
  node --eval '
      const os = require("os");
      const fs = require("fs");
      const path = require("path");

      const homeDir = os.homedir();
      const filePath = path.join(homeDir, ".claude.json");
      if (fs.existsSync(filePath)) {
          const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          fs.writeFileSync(filePath, JSON.stringify({ ...content, hasCompletedOnboarding: true }, null, 2), "utf-8");
      } else {
          fs.writeFileSync(filePath, JSON.stringify({ hasCompletedOnboarding: true }, null, 2), "utf-8");
      }'
}

# ========================
#     API Key Configuration
# ========================

configure_claude() {
    log_info "Configuring Claude Code..."
    echo "   You can get your API key from: $API_KEY_URL"
    read -s -p "🔑 Please enter your Z.AI API key: " api_key
    echo

    if [ -z "$api_key" ]; then
        log_error "API key cannot be empty. Please run the script again."
        exit 1
    fi

    ensure_dir_exists "$CONFIG_DIR"

    # Write settings.json
    node --eval '
        const os = require("os");
        const fs = require("fs");
        const path = require("path");

        const homeDir = os.homedir();
        const filePath = path.join(homeDir, ".claude", "settings.json");
        const apiKey = "'"$api_key"'";

        const content = fs.existsSync(filePath)
            ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
            : {};

        fs.writeFileSync(filePath, JSON.stringify({
            ...content,
            env: {
                ANTHROPIC_AUTH_TOKEN: apiKey,
                ANTHROPIC_BASE_URL: "'"$API_BASE_URL"'",
                API_TIMEOUT_MS: "'"$API_TIMEOUT_MS"'",
                CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: 1
            }
        }, null, 2), "utf-8");
    ' || {
        log_error "Failed to write settings.json"
        exit 1
    }

    log_success "Claude Code configured successfully"
}

# ========================
#        Main
# ========================

main() {
    echo "🚀 Starting $SCRIPT_NAME"

    check_nodejs
    install_claude_code
    configure_claude_json
    configure_claude

    echo ""
    log_success "🎉 Installation completed successfully!"
    echo ""
    echo "🚀 You can now start using Claude Code with:"
    echo "   claude"
}

main "$@"
