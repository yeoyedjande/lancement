const list = document.querySelector(".todo-list");
const form = document.querySelector(".todo-form");
const filters = document.querySelectorAll(".filter");
const taskCount = document.getElementById("task-count");
const doneCount = document.getElementById("done-count");
const clearCompleted = document.getElementById("clear-completed");
const clearAll = document.getElementById("clear-all");
const template = document.getElementById("todo-item-template");

const todos = [
  {
    title: "Finaliser la moodboard du projet",
    priority: "high",
    due: "Aujourd'hui",
    done: false,
  },
  {
    title: "Appeler le fournisseur",
    priority: "medium",
    due: "Demain",
    done: false,
  },
  {
    title: "Envoyer le compte rendu",
    priority: "low",
    due: "Vendredi",
    done: true,
  },
];

let currentFilter = "all";

const priorityLabels = {
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

const updateCounts = () => {
  const active = todos.filter((todo) => !todo.done).length;
  const done = todos.filter((todo) => todo.done).length;
  taskCount.textContent = active;
  doneCount.textContent = done;
};

const renderEmptyState = () => {
  const empty = document.createElement("li");
  empty.className = "empty";
  empty.textContent = "Aucune tâche pour le moment. Ajoutez votre première mission.";
  list.appendChild(empty);
};

const applyFilter = (todo) => {
  if (currentFilter === "active") {
    return !todo.done;
  }
  if (currentFilter === "done") {
    return todo.done;
  }
  return true;
};

const renderTodos = () => {
  list.innerHTML = "";

  const filtered = todos.filter(applyFilter);

  if (!filtered.length) {
    renderEmptyState();
  }

  filtered.forEach((todo, index) => {
    const fragment = template.content.cloneNode(true);
    const item = fragment.querySelector(".todo-item");
    const title = fragment.querySelector(".title");
    const priority = fragment.querySelector(".priority");
    const due = fragment.querySelector(".due");
    const check = fragment.querySelector(".check");
    const remove = fragment.querySelector(".delete");

    title.textContent = todo.title;
    priority.textContent = priorityLabels[todo.priority];
    priority.classList.add(todo.priority);
    due.textContent = todo.due ? `Échéance : ${todo.due}` : "Sans date";

    if (todo.done) {
      item.classList.add("done");
    }

    check.addEventListener("click", () => {
      todos[index].done = !todos[index].done;
      updateCounts();
      renderTodos();
    });

    remove.addEventListener("click", () => {
      todos.splice(index, 1);
      updateCounts();
      renderTodos();
    });

    list.appendChild(fragment);
  });
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const title = data.get("title");
  const priority = data.get("priority");
  const due = data.get("due");

  todos.unshift({
    title,
    priority,
    due: due ? new Date(due).toLocaleDateString("fr-FR") : "",
    done: false,
  });

  form.reset();
  updateCounts();
  renderTodos();
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTodos();
  });
});

clearCompleted?.addEventListener("click", () => {
  for (let i = todos.length - 1; i >= 0; i -= 1) {
    if (todos[i].done) {
      todos.splice(i, 1);
    }
  }
  updateCounts();
  renderTodos();
});

clearAll?.addEventListener("click", () => {
  todos.splice(0, todos.length);
  updateCounts();
  renderTodos();
});

updateCounts();
renderTodos();
