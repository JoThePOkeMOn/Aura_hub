// app.js

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
});

// Function to initialize the app
function initApp() {
    // Check if user is logged in
    const user = getUser();
    if (!user) {
        handleLogin();
    } else {
        renderProfile(user);
        renderTasks();
        renderRewards();
    }

    // Attach event listeners to add buttons
    document.querySelectorAll('.add-task').forEach(button => {
        button.addEventListener('click', handleAddTask);
    });
}

// Function to handle user login
function handleLogin() {
    const loginButton = document.querySelector('.add-task.add-task'); // Assuming the login button has 'add-task' class
    loginButton.addEventListener('click', () => {
        const username = prompt('Enter your username:');
        if (username) {
            const newUser = {
                username: username,
                level: 1,
                xp: 0,
                coins: 0,
                tasks: {
                    habits: [],
                    dailies: [],
                    todos: []
                },
                rewards: []
            };
            saveUser(newUser);
            renderProfile(newUser);
            renderTasks();
            renderRewards();
        }
    });
}

// Function to get user data from localStorage
function getUser() {
    return JSON.parse(localStorage.getItem('auraHubUser'));
}

// Function to save user data to localStorage
function saveUser(user) {
    localStorage.setItem('auraHubUser', JSON.stringify(user));
}

// Function to render user profile
function renderProfile(user) {
    const profileSection = document.querySelector('.profile');
    profileSection.innerHTML = `
        <img src="avatar.png" alt="Avatar" class="avatar">
        <h3>Player Level: ${user.level}</h3>
        <p>XP: <span class="xp">${user.xp}/${getXPForNextLevel(user.level)}</span></p>
        <div class="xp-bar">
            <div class="xp-progress" style="width: ${(user.xp / getXPForNextLevel(user.level)) * 100}%"></div>
        </div>
        <p>Coins: ${user.coins}</p>
    `;
}

// Function to calculate XP needed for next level
function getXPForNextLevel(level) {
    // Simple formula: next level requires level * 500 XP
    return level * 500;
}

// Function to render all tasks
function renderTasks() {
    const user = getUser();
    ['habits', 'dailies', 'todos'].forEach(category => {
        const column = document.querySelector(`.${capitalize(category)}`);
        const tasks = user.tasks[category];
        const taskContainer = column.querySelector('.tasks') || createTaskContainer(column);
        taskContainer.innerHTML = ''; // Clear existing tasks

        tasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');
            taskDiv.innerHTML = `
                ${task.name} <span class="points">+${task.xp} XP</span>
                <button class="complete-task" data-category="${category}" data-index="${index}">✔️</button>
                <button class="delete-task" data-category="${category}" data-index="${index}">❌</button>
            `;
            taskContainer.appendChild(taskDiv);
        });

        // Attach event listeners to complete and delete buttons
        taskContainer.querySelectorAll('.complete-task').forEach(button => {
            button.addEventListener('click', handleCompleteTask);
        });

        taskContainer.querySelectorAll('.delete-task').forEach(button => {
            button.addEventListener('click', handleDeleteTask);
        });
    });
}

// Function to create a task container within a column
function createTaskContainer(column) {
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('tasks');
    column.appendChild(taskContainer);
    return taskContainer;
}

// Function to handle adding a new task
function handleAddTask(e) {
    const category = getCategoryFromButton(e.target);
    if (!category) return;

    const taskName = prompt(`Enter the name of the new ${category.slice(0, -1)}:`);
    if (!taskName) return;

    const taskXP = parseInt(prompt('Enter the XP points for this task:'), 10);
    if (isNaN(taskXP) || taskXP <= 0) {
        alert('Please enter a valid XP value.');
        return;
    }

    const user = getUser();
    user.tasks[category].push({ name: taskName, xp: taskXP });
    saveUser(user);
    renderTasks();
}

// Helper function to get category from button
function getCategoryFromButton(button) {
    const column = button.parentElement;
    const header = column.querySelector('h2').textContent.toLowerCase();
    if (header.includes('habit')) return 'habits';
    if (header.includes('daily')) return 'dailies';
    if (header.includes('to do')) return 'todos';
    if (header.includes('reward')) return 'rewards';
    return null;
}

// Function to handle completing a task
function handleCompleteTask(e) {
    const category = e.target.dataset.category;
    const index = parseInt(e.target.dataset.index, 10);
    const user = getUser();

    if (category === 'rewards') return; // Rewards are handled differently

    const task = user.tasks[category][index];
    user.xp += task.xp;
    user.coins += Math.floor(task.xp / 10); // Example: earn coins based on XP

    // Check for level up
    const xpForNext = getXPForNextLevel(user.level);
    if (user.xp >= xpForNext) {
        user.level += 1;
        user.xp -= xpForNext;
        alert(`Congratulations! You've reached level ${user.level}.`);
    }

    saveUser(user);
    renderProfile(user);
    renderTasks();
}

// Function to handle deleting a task
function handleDeleteTask(e) {
    const category = e.target.dataset.category;
    const index = parseInt(e.target.dataset.index, 10);
    const user = getUser();

    user.tasks[category].splice(index, 1);
    saveUser(user);
    renderTasks();
}

// Function to render rewards
function renderRewards() {
    const user = getUser();
    const rewardsColumn = document.querySelector('.Rewards');
    const rewardsContainer = rewardsColumn.querySelector('.tasks') || createRewardContainer(rewardsColumn);
    rewardsContainer.innerHTML = ''; // Clear existing rewards

    user.rewards.forEach((reward, index) => {
        const rewardDiv = document.createElement('div');
        rewardDiv.classList.add('task');
        rewardDiv.innerHTML = `
            ${reward.name} <span class="cost">-${reward.cost} Coins</span>
            <button class="claim-reward" data-index="${index}">🎁</button>
            <button class="delete-reward" data-index="${index}">❌</button>
        `;
        rewardsContainer.appendChild(rewardDiv);
    });

    // Attach event listeners to claim and delete buttons
    rewardsContainer.querySelectorAll('.claim-reward').forEach(button => {
        button.addEventListener('click', handleClaimReward);
    });

    rewardsContainer.querySelectorAll('.delete-reward').forEach(button => {
        button.addEventListener('click', handleDeleteReward);
    });
}

// Function to create a rewards container
function createRewardContainer(column) {
    const rewardsContainer = document.createElement('div');
    rewardsContainer.classList.add('tasks');
    column.appendChild(rewardsContainer);
    return rewardsContainer;
}

// Function to handle adding a new reward
function handleAddTask(e) {
    const category = getCategoryFromButton(e.target);
    if (category === 'rewards') {
        const rewardName = prompt('Enter the name of the new reward:');
        if (!rewardName) return;

        const rewardCost = parseInt(prompt('Enter the cost in coins for this reward:'), 10);
        if (isNaN(rewardCost) || rewardCost <= 0) {
            alert('Please enter a valid coin value.');
            return;
        }

        const user = getUser();
        user.rewards.push({ name: rewardName, cost: rewardCost });
        saveUser(user);
        renderRewards();
    } else {
        // Handle adding other tasks (habits, dailies, todos)
        handleAddTaskOriginal(e);
    }
}

// Store the original handleAddTask to call for non-reward categories
const handleAddTaskOriginal = handleAddTask;

// Function to handle claiming a reward
function handleClaimReward(e) {
    const index = parseInt(e.target.dataset.index, 10);
    const user = getUser();
    const reward = user.rewards[index];

    if (user.coins >= reward.cost) {
        user.coins -= reward.cost;
        alert(`You have claimed: ${reward.name}`);
        saveUser(user);
        renderProfile(user);
    } else {
        alert('You do not have enough coins to claim this reward.');
    }
}

// Function to handle deleting a reward
function handleDeleteReward(e) {
    const index = parseInt(e.target.dataset.index, 10);
    const user = getUser();

    if (confirm(`Are you sure you want to delete the reward "${user.rewards[index].name}"?`)) {
        user.rewards.splice(index, 1);
        saveUser(user);
        renderRewards();
    }
}

// Helper function to capitalize the first letter
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
