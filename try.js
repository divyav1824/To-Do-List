document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todo-container');
    const ProgressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        ProgressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

        if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            triggerConfetti(); // Assuming confetti is defined elsewhere or from a library
        }
    };

    const saveTaskToLocalStorage = () => {
        try {
            const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
                text: li.querySelector('span').textContent,
                completed: li.querySelector('.checkbox').checked
            }));
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    const loadTasksFromLocalStorage = () => {
        try {
            const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
            savedTasks.forEach(({ text, completed }) => addTask(text, completed, true));
            toggleEmptyState();
            updateProgress(false); // Don't trigger confetti on load
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    };

    const addTask = (taskText = null, completed = false, fromStorage = false) => {
        let finalTaskText;

        if (fromStorage) {
            // Loading from storage: use provided text
            finalTaskText = taskText;
        } else {
            // From user input: get from input
            finalTaskText = taskInput.value.trim();
            if (!finalTaskText) return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" />
            <span>${finalTaskText}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>`;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        // Set initial state if loading from storage
        if (completed) {
            checkbox.checked = true;
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            updateProgress();
            saveTaskToLocalStorage();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTaskToLocalStorage();
            }
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        });

        taskList.appendChild(li);

        if (!fromStorage) {
            taskInput.value = ''; // Clear input only for new tasks
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        }
    };

    // Prevent form submission and add task
    addTaskBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent page reload
        addTask(null, false, false);
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission on Enter
            addTask(null, false, false);
        }
    });

    loadTasksFromLocalStorage();
});
             // Assuming confetti is defined elsewhere or from a library
const triggerConfetti = ()=>{
    const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
}