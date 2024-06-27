document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
});

document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskName = document.getElementById('taskName').value;
    const taskDeadline = document.getElementById('taskDeadline').value;
    const taskPriority = document.getElementById('taskPriority').value;
    
    const task = {
        name: taskName,
        deadline: taskDeadline,
        priority: taskPriority,
        status: 'Not Started'
    };
    
    addTaskToList(task);
    saveTaskToLocalStorage(task);
    
    document.getElementById('taskForm').reset();
});

document.getElementById('searchTask').addEventListener('input', filterTasks);
document.getElementById('filterPriority').addEventListener('change', filterTasks);
document.getElementById('filterStatus').addEventListener('change', filterTasks);
document.getElementById('filterToday').addEventListener('click', filterDueToday);

function addTaskToList(task) {
    const taskList = document.getElementById('taskList');
    
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    
    taskDiv.innerHTML = `
        <div>
            <h3 contenteditable="true" onblur="editTask(this, '${task.name}', 'name')">${task.name}</h3>
            <p>Deadline: <span contenteditable="true" onblur="editTask(this, '${task.name}', 'deadline')">${task.deadline}</span></p>
            <p>Priority: 
                <select onchange="editTask(this, '${task.name}', 'priority')">
                    <option value="High"${task.priority === 'High' ? ' selected' : ''}>High</option>
                    <option value="Medium"${task.priority === 'Medium' ? ' selected' : ''}>Medium</option>
                    <option value="Low"${task.priority === 'Low' ? ' selected' : ''}>Low</option>
                </select>
            </p>
            <p>Status: 
                <select onchange="editTask(this, '${task.name}', 'status')">
                    <option value="Not Started"${task.status === 'Not Started' ? ' selected' : ''}>Not Started</option>
                    <option value="In Progress"${task.status === 'In Progress' ? ' selected' : ''}>In Progress</option>
                    <option value="Completed"${task.status === 'Completed' ? ' selected' : ''}>Completed</option>
                </select>
            </p>
        </div>
        <button onclick="removeTask(this, '${task.name}')">Remove</button>
        <button class="edit" onclick="toggleEditMode(this)">Edit</button>
    `;
    
    taskList.appendChild(taskDiv);
}

function removeTask(button, taskName) {
    const task = button.parentElement;
    task.remove();
    removeTaskFromLocalStorage(taskName);
}

function editTask(element, taskName, field) {
    const newValue = element.textContent.trim();
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.name === taskName) {
            switch (field) {
                case 'name':
                    task.name = newValue;
                    break;
                case 'deadline':
                    task.deadline = newValue;
                    break;
                case 'priority':
                    task.priority = newValue;
                    break;
                case 'status':
                    task.status = newValue;
                    break;
                default:
                    break;
            }
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToList(task));
}

function removeTaskFromLocalStorage(taskName) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.name !== taskName);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks() {
    const searchTask = document.getElementById('searchTask').value.toLowerCase();
    const filterPriority = document.getElementById('filterPriority').value;
    const filterStatus = document.getElementById('filterStatus').value;

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.name.toLowerCase().includes(searchTask);
        const matchesPriority = !filterPriority || task.priority === filterPriority;
        const matchesStatus = !filterStatus || task.status === filterStatus;
        return matchesSearch && matchesPriority && matchesStatus;
    });

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    if (filteredTasks.length > 0) {
        filteredTasks.forEach(task => addTaskToList(task));
    } else {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.textContent = 'No tasks found matching your criteria.';
        taskList.appendChild(noResultsDiv);
    }
}

function filterDueToday() {
    const today = new Date().toISOString().slice(0, 10);
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const dueTodayTasks = tasks.filter(task => task.deadline === today);

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    if (dueTodayTasks.length > 0) {
        dueTodayTasks.forEach(task => addTaskToList(task));
    } else {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.textContent = 'No tasks due today.';
        taskList.appendChild(noResultsDiv);
    }
}

function toggleEditMode(button) {
    const taskDiv = button.parentElement;
    const buttons = taskDiv.querySelectorAll('button');
    
    buttons.forEach(btn => {
        if (btn.classList.contains('edit')) {
            btn.style.display = 'none';
        }
    });

    const spans = taskDiv.querySelectorAll('span');
    spans.forEach(span => {
        span.contentEditable = true;
        span.classList.add('editable');
    });
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    const container = document.querySelector('.container');
    container.classList.toggle('dark-mode');

    const taskList = document.getElementById('taskList');
    taskList.classList.toggle('dark-mode');
}
