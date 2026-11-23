
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const statusMessage = document.getElementById("statusMessage");
const filterInput = document.getElementById("filterInput");

// Deployed Flask backend URL
const API_URL = "https://personal-task-manager-api-0xuh.onrender.com";

// Stores all tasks received from the backend
let allTasks = [];
let messageTimer;


// ------------------------------------
// 1. DISPLAY SUCCESS / ERROR MESSAGES
// ------------------------------------

function showMessage(message, isError = false) {
    statusMessage.textContent = message;

    statusMessage.style.color = isError ? "red" : "green";

    clearTimeout(messageTimer);

    messageTimer = setTimeout(() => {
        statusMessage.textContent = "";
    }, 3000);
}


// ------------------------------------
// 2. SAFELY READ API RESPONSE
// ------------------------------------

async function readResponse(response) {
    const responseText = await response.text();

    let data = {};

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            throw new Error("The server returned an invalid response.");
        }
    }

    if (!response.ok) {
        throw new Error(data.message || `Request failed: ${response.status}`);
    }

    return data;
}


// ------------------------------------
// 3. DISPLAY A SINGLE TASK
// ------------------------------------

function displayTask(task) {

    const li = document.createElement("li");

    // Apply completed-task styling
    if (task.completed) {
        li.classList.add("completed-task");
    }

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    // Completed tasks cannot be unchecked
    checkbox.disabled = task.completed;

    // Task name
    const taskName = document.createElement("span");
    taskName.textContent = task.task;

    // Priority
    const priorityLabel = document.createElement("small");
    priorityLabel.textContent = `Priority: ${task.priority}`;

    // Creation date
    const dateLabel = document.createElement("small");

    if (task.created_at) {
        const date = new Date(task.created_at.replace(" ", "T"));

        dateLabel.textContent = `Created: ${
            isNaN(date.getTime())
                ? task.created_at
                : date.toLocaleString()
        }`;
    } else {
        dateLabel.textContent = "Date unavailable";
    }

    // Completion status
    const statusLabel = document.createElement("small");
    statusLabel.textContent = task.completed ? "Completed" : "Pending";

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";


    // --------------------------------
    // 4. COMPLETE TASK
    // --------------------------------

    checkbox.addEventListener("change", async () => {

        try {
            const response = await fetch(
                `${API_URL}/api/tasks/${task.id}`,
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

            await readResponse(response);

            // Update local task data
            task.completed = checkbox.checked;

            // Refresh displayed tasks
            displayFilteredTasks();

            showMessage("Task completed successfully!");

        } catch (error) {
            console.error("Update task error:", error);

            checkbox.checked = task.completed;

            showMessage(error.message || "Couldn't update task.", true);
        }
    });


    // --------------------------------
    // 5. DELETE TASK
    // --------------------------------

    deleteButton.addEventListener("click", async () => {

        try {
            const response = await fetch(
                `${API_URL}/api/tasks/${task.id}`,
                {
                    method: "DELETE"
                }
            );

            await readResponse(response);

            // Remove task from local array
            allTasks = allTasks.filter(
                item => item.id !== task.id
            );

            displayFilteredTasks();

            showMessage("Task deleted successfully!");

        } catch (error) {
            console.error("Delete task error:", error);

            showMessage(error.message || "Couldn't delete task.", true);
        }
    });


    // Add elements to the task item
    li.appendChild(checkbox);
    li.appendChild(taskName);
    li.appendChild(priorityLabel);
    li.appendChild(dateLabel);
    li.appendChild(statusLabel);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
}


// ------------------------------------
// 6. LOAD TASKS FROM BACKEND
// ------------------------------------

async function loadTasks() {

    try {
        const response = await fetch(`${API_URL}/api/tasks`);

        const data = await readResponse(response);

        allTasks = data;

        displayFilteredTasks();

    } catch (error) {
        console.error("Load tasks error:", error);

        showMessage(error.message || "Couldn't load tasks.", true);
    }
}


// ------------------------------------
// 7. FILTER TASKS
// ------------------------------------

function displayFilteredTasks() {

    const filter = filterInput.value;

    taskList.innerHTML = "";

    const filteredTasks = allTasks.filter(task => {

        if (filter === "All") {
            return true;
        }

        if (filter === "Completed") {
            return task.completed;
        }

        if (filter === "Pending") {
            return !task.completed;
        }

        return task.priority === filter;
    });

    filteredTasks.forEach(displayTask);
}


// Listen for filter changes
filterInput.addEventListener("change", displayFilteredTasks);


// ------------------------------------
// 8. ADD A NEW TASK
// ------------------------------------

addButton.addEventListener("click", async () => {

    const taskName = taskInput.value.trim();
    const priority = priorityInput.value;

    // Validate task input
    if (taskName === "") {
        showMessage("Please enter a task!", true);
        return;
    }

    addButton.disabled = true;

    try {

        const response = await fetch(`${API_URL}/api/tasks`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                task: taskName,
                priority: priority
            })
        });

        const data = await readResponse(response);

        // Add the newly created task to the local array
        allTasks.unshift(data);

        // Clear input
        taskInput.value = "";

        // Show updated task list
        displayFilteredTasks();

        showMessage("Task added successfully!");

    } catch (error) {
        console.error("Add task error:", error);

        showMessage(error.message || "Couldn't add task.", true);

    } finally {
        addButton.disabled = false;
    }
});


// ------------------------------------
// 9. LOAD TASKS WHEN PAGE OPENS
// ------------------------------------

loadTasks();
