(function () {
  "use strict";

  const config = window.APP_CONFIG;

  if (!config) {
    throw new Error("A configuração da aplicação não foi carregada.");
  }

  const elements = {
    form: document.querySelector("#todo-form"),
    titleInput: document.querySelector("#todo-title"),
    addButton: document.querySelector("#add-button"),
    list: document.querySelector("#todo-list"),
    count: document.querySelector("#todo-count"),
    emptyState: document.querySelector("#empty-state"),
    error: document.querySelector("#form-error"),
    loading: document.querySelector("#loading-message"),
    modeLabel: document.querySelector("#mode-label"),
    modeDetail: document.querySelector("#mode-detail"),
    modeToggle: document.querySelector("#mode-toggle"),
    apiUrlRow: document.querySelector("#api-url-row"),
    apiUrlInput: document.querySelector("#api-url-input"),
  };

  let repository = config.USE_API
    ? createApiRepository(config.API_URL)
    : createLocalRepository(config.LOCAL_STORAGE_KEY);

  let todos = [];
  let isBusy = false;

  configureModeLabel();
  bindEvents();
  refreshTodos();

  function bindEvents() {
    elements.form.addEventListener("submit", handleCreate);
    elements.list.addEventListener("click", handleListClick);
    elements.modeToggle.addEventListener("change", handleModeToggle);
    elements.apiUrlInput.addEventListener("change", handleApiUrlChange);
    elements.apiUrlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") elements.apiUrlInput.blur();
    });
  }

  function handleModeToggle() {
    config.USE_API = elements.modeToggle.checked;
    reinitRepository();
    configureModeLabel();
    refreshTodos();
  }

  function handleApiUrlChange() {
    const url = elements.apiUrlInput.value.trim();
    if (url) {
      config.API_URL = url;
      reinitRepository();
      refreshTodos();
    }
  }

  function reinitRepository() {
    repository = config.USE_API
      ? createApiRepository(config.API_URL)
      : createLocalRepository(config.LOCAL_STORAGE_KEY);
  }

  function configureModeLabel() {
    if (config.USE_API) {
      elements.modeLabel.textContent = "Modo API";
      elements.modeDetail.textContent = config.API_URL;
      elements.modeToggle.checked = true;
      elements.apiUrlInput.value = config.API_URL;
      elements.apiUrlRow.hidden = false;
      return;
    }

    elements.modeLabel.textContent = "Modo local";
    elements.modeDetail.textContent = "Dados salvos neste navegador";
    elements.modeToggle.checked = false;
    elements.apiUrlRow.hidden = true;
  }

  async function handleCreate(event) {
    event.preventDefault();

    const title = elements.titleInput.value.trim();

    if (!title) {
      showError("Digite um título para a tarefa.");
      elements.titleInput.focus();
      return;
    }

    await runAction(async () => {
      await repository.create(title);
      elements.form.reset();
      await refreshTodos({ showLoading: false });
      elements.titleInput.focus();
    });
  }

  async function handleListClick(event) {
    const button = event.target.closest("button[data-action]");

    if (!button || isBusy) {
      return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (!Number.isInteger(id)) {
      showError("Não foi possível identificar a tarefa.");
      return;
    }

    if (action === "delete") {
      const todo = todos.find((item) => item.id === id);
      const confirmed = window.confirm(`Remover a tarefa "${todo?.title ?? id}"?`);

      if (!confirmed) {
        return;
      }
    }

    await runAction(async () => {
      if (action === "toggle") {
        await repository.toggle(id);
      }

      if (action === "delete") {
        await repository.remove(id);
      }

      await refreshTodos({ showLoading: false });
    });
  }

  async function refreshTodos(options = { showLoading: true }) {
    if (options.showLoading) {
      setBusy(true);
      clearError();
    }

    try {
      todos = await repository.list();
      renderTodos();
    } catch (error) {
      showError(readableError(error));
    } finally {
      if (options.showLoading) {
        setBusy(false);
      }
    }
  }

  async function runAction(action) {
    setBusy(true);
    clearError();

    try {
      await action();
    } catch (error) {
      showError(readableError(error));
    } finally {
      setBusy(false);
    }
  }

  function renderTodos() {
    elements.list.replaceChildren();

    for (const todo of todos) {
      const item = document.createElement("li");
      item.className = `todo-item${todo.completed ? " completed" : ""}`;

      const toggleButton = document.createElement("button");
      toggleButton.type = "button";
      toggleButton.className = "todo-toggle";
      toggleButton.dataset.action = "toggle";
      toggleButton.dataset.id = String(todo.id);
      toggleButton.textContent = "✓";
      toggleButton.setAttribute(
        "aria-label",
        todo.completed
          ? `Reabrir tarefa: ${todo.title}`
          : `Concluir tarefa: ${todo.title}`,
      );

      const title = document.createElement("span");
      title.className = "todo-title";
      title.textContent = todo.title;

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-button";
      deleteButton.dataset.action = "delete";
      deleteButton.dataset.id = String(todo.id);
      deleteButton.textContent = "Remover";
      deleteButton.setAttribute("aria-label", `Remover tarefa: ${todo.title}`);

      item.append(toggleButton, title, deleteButton);
      elements.list.append(item);
    }

    elements.emptyState.hidden = todos.length > 0;
    elements.count.textContent = formatCount(todos.length);
  }

  function setBusy(value) {
    isBusy = value;
    elements.loading.hidden = !value;
    elements.titleInput.disabled = value;
    elements.addButton.disabled = value;

    for (const button of elements.list.querySelectorAll("button")) {
      button.disabled = value;
    }
  }

  function showError(message) {
    elements.error.textContent = message;
    elements.error.hidden = false;
  }

  function clearError() {
    elements.error.textContent = "";
    elements.error.hidden = true;
  }

  function formatCount(total) {
    if (total === 0) {
      return "0 tarefas";
    }

    return total === 1 ? "1 tarefa" : `${total} tarefas`;
  }

  function readableError(error) {
    if (error instanceof TypeError && config.USE_API) {
      return `Não foi possível acessar ${config.API_URL}. Verifique se a API está em execução.`;
    }

    return error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
  }

  function createLocalRepository(storageKey) {
    const initialTodos = [
      {
        id: 1,
        title: "Conhecer o contrato da API",
        completed: true,
      },
      {
        id: 2,
        title: "Implementar o primeiro paradigma",
        completed: false,
      },
    ];

    ensureInitialData();

    return {
      async list() {
        return read();
      },

      async create(title) {
        const currentTodos = read();
        const nextId =
          currentTodos.reduce((largest, todo) => Math.max(largest, todo.id), 0) + 1;
        const newTodo = { id: nextId, title, completed: false };

        write([...currentTodos, newTodo]);
        return newTodo;
      },

      async toggle(id) {
        const currentTodos = read();
        const existingTodo = currentTodos.find((todo) => todo.id === id);

        if (!existingTodo) {
          throw new Error("Tarefa não encontrada.");
        }

        const updatedTodo = {
          ...existingTodo,
          completed: !existingTodo.completed,
        };

        write(
          currentTodos.map((todo) => (todo.id === id ? updatedTodo : todo)),
        );

        return updatedTodo;
      },

      async remove(id) {
        const currentTodos = read();

        if (!currentTodos.some((todo) => todo.id === id)) {
          throw new Error("Tarefa não encontrada.");
        }

        write(currentTodos.filter((todo) => todo.id !== id));
      },
    };

    function ensureInitialData() {
      if (window.localStorage.getItem(storageKey) === null) {
        write(initialTodos);
      }
    }

    function read() {
      try {
        const value = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
        return Array.isArray(value) ? value : [];
      } catch {
        throw new Error("Os dados locais estão inválidos.");
      }
    }

    function write(value) {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    }
  }

  function createApiRepository(baseUrl) {
    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");

    return {
      list() {
        return request("/todos");
      },

      create(title) {
        return request("/todos", {
          method: "POST",
          body: JSON.stringify({ title }),
        });
      },

      toggle(id) {
        return request(`/todos/${id}/toggle`, {
          method: "PATCH",
        });
      },

      remove(id) {
        return request(`/todos/${id}`, {
          method: "DELETE",
        });
      },
    };

    async function request(path, options = {}) {
      const headers = {
        Accept: "application/json",
        ...options.headers,
      };

      if (options.body) {
        headers["Content-Type"] = "application/json";
      }

      const response = await window.fetch(`${normalizedBaseUrl}${path}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorBody = await readJsonSafely(response);
        throw new Error(errorBody?.error ?? `Erro HTTP ${response.status}.`);
      }

      if (response.status === 204) {
        return undefined;
      }

      return readJsonSafely(response);
    }

    async function readJsonSafely(response) {
      const text = await response.text();
      return text ? JSON.parse(text) : undefined;
    }
  }
})();
