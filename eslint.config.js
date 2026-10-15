import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "node_modules", "build"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // 3. Подключаем плагины
    plugins: {
      react: react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    // 4. Настройки правил (Rules)
    rules: {
      // Правила для React Hooks (обязательно в React)
      ...reactHooks.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error", // Проверерка правила хуков
      "react-hooks/exhaustive-deps": "warn", // Проверерка зависимости в useEffect

      // Правила для React Refresh (быстрая перезагрузка в Vite)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
]);
