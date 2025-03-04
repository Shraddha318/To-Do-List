document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo');
    const addTaskButton = document.getElementById('add-task-btn');
    const todoList = document.getElementById('todo-list');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    console.log("Loaded tasks from localStorage:", tasks);

    // Render existing tasks
    tasks.forEach(task => renderTask(task));

    // Add new task event listener
    addTaskButton.addEventListener('click', () => {
        const text = todoInput.value.trim();
        if (text === "") {
            console.warn("Task input is empty. No task added.");
            return;
        }

        const newTask = {
            id: Date.now(),
            text: text,
            complete: false
        };

        console.log("New task created:", newTask);

        tasks.push(newTask);
        saveTasks();
        renderTask(newTask);

        todoInput.value = ''; // Clear input field
    });

    // Render a task to the DOM
    function renderTask(task) {
        console.log("Rendering task:", task);

        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        if (task.complete) li.classList.add('completed');

        li.innerHTML = `
            <span>${task.text}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        // Toggle task completion
        li.querySelector('span').addEventListener('click', () => {
            task.complete = !task.complete;
            li.classList.toggle('completed');
            saveTasks();
            console.log(`Task ${task.id} completion toggled. Current status:`, task.complete);
        });

        // Edit task functionality
        li.querySelector('.edit-btn').addEventListener('click', () => {
            const span = li.querySelector('span');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;

            li.insertBefore(input, span);
            li.removeChild(span);
            input.focus();

            input.addEventListener('blur', () => {
                const newText = input.value.trim();
                if (newText) {
                    task.text = newText;
                    saveTasks();
                    console.log(`Task ${task.id} updated. New text:`, newText);
                }

                li.insertBefore(span, input);
                li.removeChild(input);
                span.textContent = task.text;
            });
        });

        // Delete task functionality
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            li.remove();
            saveTasks();
            console.log(`Task ${task.id} deleted.`);
        });

        todoList.appendChild(li);
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        console.log("Tasks saved to localStorage:", tasks);
    }
});
