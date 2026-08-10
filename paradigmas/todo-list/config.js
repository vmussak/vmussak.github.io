/*
 * FEATURE FLAG
 *
 * false: usa o localStorage e funciona abrindo o index.html diretamente.
 * true:  usa a API configurada em API_URL.
 */
window.APP_CONFIG = {
  USE_API: false,
  API_URL: "http://localhost:5000",
  LOCAL_STORAGE_KEY: "paradigm-todo.items",
};
