
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const statusMessage = document.getElementById("statusMessage");
const filterInput = document.getElementById("filterInput");
let allTasks = [];

let messageTimer;


// Display success or error messages
function showMessage(message, color = "#16a34a") {
    statusMessage.textContent = message;
    statusMessage.style.color = color;

    clearTimeout(messageTimer);

    messageTimer = setTimeout(() => {
        statusMessage.textContent = "";
    }, 3000);
}


// Display an individual task
function displayTask(task) {
    const li = document.createElement("li");

    li.dataset.id = task.id;

    // Checkbox for task completion
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = task.completed;

// Prevent changing a completed task
checkbox.disabled = task.completed;

    // Apply strikethrough if task is completed
if (task.completed) {
    li.classList.add("completed-task");
}
    // Task name
    const span = document.createElement("span");
    span.textContent = task.task;

    // Priority label
    const priorityLabel = document.createElement("small");
    priorityLabel.textContent = task.priority || "Medium";
    priorityLabel.style.fontWeight = "bold";
    priorityLabel.style.marginLeft = "8px";

    // Creation date
    const dateLabel = document.createElement("small");

    if (task.created_at) {
        const date = new Date(task.created_at.replace(" ", "T"));
        dateLabel.textContent = date.toLocaleDateString();
    }
    // Task status label
const statusLabel = document.createElement("small");

if (task.completed) {
    statusLabel.textContent = "Completed";
    statusLabel.style.color = "#16a34a";
} else {
    statusLabel.textContent = "Pending";
    statusLabel.style.color = "#d97706";
}

statusLabel.style.fontWeight = "bold";

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    // Checkbox change: PUT request
    checkbox.addEventListener("change", async function () {
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/api/tasks/${task.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        completed: checkbox.checked
                    })

                }
            );

            const data = await response.json();

if (!response.ok) {
    throw new Error(data.message);
}

task.completed = checkbox.checked;

displayFilteredTasks();

showMessage("Task completed successfully!");

        } catch (error) {
            console.error("Update error:", error);

            checkbox.checked = !checkbox.checked;

            alert("Could not update task!");
        }
    });


    // Delete button: DELETE request
    deleteButton.addEventListener("click", async function () {
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/api/tasks/${task.id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            allTasks = allTasks.filter(item => item.id !== task.id);
            displayFilteredTasks();

            console.log(data.message);

            showMessage("Task deleted successfully!");

        } catch (error) {
            console.error("Delete error:", error);

            alert("Could not delete task!");
        }
    });


    // Add elements to the task list item
li.appendChild(checkbox);
li.appendChild(span);
li.appendChild(priorityLabel);
li.appendChild(dateLabel);
li.appendChild(statusLabel);
li.appendChild(deleteButton);

    taskList.appendChild(li);
}


// GET request: Load tasks from Flask and SQLite
async function loadTasks() {
    try {
        const response = await fetch(
            "http://127.0.0.1:5000/api/tasks"
        );

        if (!response.ok) {
            throw new Error("Could not load tasks");
        }

        allTasks = await response.json();
        displayFilteredTasks();

    } catch (error) {
        console.error("Loading error:", error);
        showMessage("Could not load tasks!", "#dc2626");
    }
}

function displayFilteredTasks() {
    const filter = filterInput.value;

    taskList.innerHTML = "";

    const filteredTasks = allTasks.filter(task => {
        if (filter === "All") return true;
        if (filter === "Completed") return task.completed;
        if (filter === "Pending") return !task.completed;

        return task.priority === filter;
    });

    filteredTasks.forEach(displayTask);
}
filterInput.addEventListener("change", displayFilteredTasks);

// POST request: Add a new task
addButton.addEventListener("click", async function () {

    const taskName = taskInput.value.trim();
    const priority = priorityInput.value;

    if (taskName === "") {
        showMessage("Please enter a task!", "#dc2626");
        return;
    }

    try {
        const response = await fetch(
            "http://127.0.0.1:5000/api/tasks",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    task: taskName,
                    priority: priority
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        allTasks.unshift(data);
        displayFilteredTasks();

        taskInput.value = "";

        priorityInput.value = "Medium";

        showMessage("Task added successfully!");

    } catch (error) {
        console.error("Add task error:", error);

        showMessage("Could not add task!", "#dc2626");
    }
});


// Load saved tasks when the page opens
loadTasks();
