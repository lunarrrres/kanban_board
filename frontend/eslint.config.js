import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default [
  // Ігноруємо папки з артефактами збірки та звітами
  { ignores: ["dist", "coverage", "node_modules"] },

  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Налаштування згідно з твоїм описом у звіті:
      "no-unused-vars": "off", // Вимкнено для зарезервованих змінних MVP
      "no-console": "off", // Попередження для console у продуктовому коді

      // Вимкнення специфічних правил React Hooks для гнучкості розробки
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/static-components": "off", // Вимкнено згідно з Лабою №3
      "react-hooks/purity": "off", // Вимкнено згідно з Лабою №3

      // Дозволяємо Fast Refresh
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Інтеграція Prettier: видає помилку ESLint, якщо стиль порушено
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          semi: true,
          singleQuote: false,
          tabWidth: 2,
          trailingComma: "es5",
        },
      ],
    },
  },
  // Вимикаємо правила ESLint, які можуть конфліктувати з Prettier
  configPrettier,
];
