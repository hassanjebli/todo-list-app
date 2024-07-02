let tasks = [];

// Load tasks from localStorage when the page loads
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        add();
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function add() {
    let todoList = document.querySelector('.todo-list');
    todoList.innerHTML = "";
    
    tasks.forEach((task, index) => {
        let taskHTML = `
            <div class="todo-item ${task.isDone ? 'completed' : ''}" data-index="${index}">
                <div class="todo-content">
                    <p class="mb-0 todo-title">${task.title}</p>
                    <small class="text-muted todo-date">Due : ${task.date}</small>
                </div>
                <div class="todo-actions">
                    <button class="btn btn-edit"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-complete">
                        <i class="fas ${task.isDone ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="btn btn-delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
        todoList.innerHTML += taskHTML;
    });
    document.querySelector(".todo-input").value = "";
    addEventListeners();
}

function addEventListeners() {
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', editTask);
    });
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', deleteTask);
    });
    document.querySelectorAll('.btn-complete').forEach(button => {
        button.addEventListener('click', completeTask);
    });
}

function editTask(event) {
    const todoItem = event.target.closest('.todo-item');
    const index = todoItem.dataset.index;
    const task = tasks[index];
    
    todoItem.innerHTML = `
        <div class="todo-content">
            <input type="text" class="form-control edit-input" value="${task.title}">
        </div>
        <div class="todo-actions">
            <button class="btn btn-confirm"><i class="fas fa-check"></i></button>
        </div>
    `;
    
    const confirmButton = todoItem.querySelector('.btn-confirm');
    confirmButton.addEventListener('click', () => confirmEdit(index));
}

function confirmEdit(index) {
    const todoItem = document.querySelector(`.todo-item[data-index="${index}"]`);
    const newTitle = todoItem.querySelector('.edit-input').value.trim();
    if (newTitle === "") {
        alert("Task cannot be empty!");
        return;
    }
    tasks[index].title = newTitle;
    saveTasks();
    add();
}

function deleteTask(event) {
    const index = event.target.closest('.todo-item').dataset.index;
    tasks.splice(index, 1);
    saveTasks();
    add();
}

function completeTask(event) {
    const index = event.target.closest('.todo-item').dataset.index;
    tasks[index].isDone = !tasks[index].isDone;
    saveTasks();
    add();
}

document.querySelector(".btn-add").addEventListener("click", () => {
    let title = document.querySelector(".todo-input").value.trim();
    if (title === "") {
        alert("Task cannot be empty!");
        return;
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    let taskObj = {
        "title": title,
        "date": `${year}-${month}-${day}`,
        "isDone": false
    }
    tasks.push(taskObj);
    saveTasks();
    add();
});

// Load tasks when the page loads
loadTasks();