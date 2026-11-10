const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");
const taskSearch = document.getElementById("taskSearch");

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    const searchText = taskSearch.value.toLowerCase();

    tasks
        .filter(task => task.name.toLowerCase().includes(searchText))
        .forEach(task => {
            const li = document.createElement("li");
            li.className = "task-item";

            if (task.completed) {
                li.classList.add("completed");
            }

            const taskName = document.createElement("span");
            taskName.textContent = task.name;

            const taskDateText = document.createElement("span");
            taskDateText.textContent = task.date || "No due date";

            const completeButton = document.createElement("button");
            completeButton.textContent = task.completed ? "Undo" : "Complete";
            completeButton.type = "button";

            completeButton.addEventListener("click", () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";

            deleteButton.addEventListener("click", () => {
                tasks = tasks.filter(item => item.id !== task.id);
                saveTasks();
                renderTasks();
            });

            li.append(taskName, taskDateText, completeButton, deleteButton);
            taskList.appendChild(li);
        });

    updateProgress();
    renderDeadlines();
}

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("completionRate").textContent = percentage + "%";

    document.getElementById("previewTaskCount").textContent = total;
    document.getElementById("previewCompleted").textContent = completed + " completed";
    document.getElementById("previewPending").textContent = pending + " pending";
    document.getElementById("previewProgress").textContent = percentage + "%";
    document.getElementById("previewProgressBar").style.width = percentage + "%";
}

function renderDeadlines() {
    const deadlineList = document.getElementById("deadlineList");
    deadlineList.innerHTML = "";

    const datedTasks = tasks
        .filter(task => task.date && !task.completed)
        .sort((a, b) => a.date.localeCompare(b.date));

    if (datedTasks.length === 0) {
        deadlineList.textContent = "No upcoming deadlines.";
        return;
    }

    datedTasks.forEach(task => {
        const item = document.createElement("p");
        item.textContent = task.name + " — " + task.date;
        deadlineList.appendChild(item);
    });

    const nextTask = datedTasks[0];

    document.getElementById("nextDeadline").textContent = nextTask.name;
    document.getElementById("nextDeadlineDate").textContent = nextTask.date;
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = taskInput.value.trim();

    if (name === "") return;

    const newTask = {
        id: Date.now(),
        name: name,
        date: taskDate.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    taskForm.reset();
    renderTasks();
});

taskSearch.addEventListener("input", renderTasks);

document.getElementById("clearTasksButton").addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all tasks?")) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
});

renderTasks();
