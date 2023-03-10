'use strict';

// Workshop - TODO list

// оголошуємо змінні з якими будемо працювати
const form = document.querySelector('.create-task-form');
const clearBtn = document.querySelector('.clear-tasks');
const taskInput = document.querySelector('.task-input');
const filter = document.querySelector('.filter-input');
const taskList = document.querySelector('.collection');
// const editBtn = document.querySelector('.edit')

// слухачі подій
// запускаємо функцію showPosts коли весь HTML загружений
document.addEventListener('DOMContentLoaded', showPosts);
// запускаємо функцію addTask коли відправляємо форму (клікаємо на кнопку "Додати завдання")
form.addEventListener('submit', addTask);
// запускаємо функцію deleteTask коли клік попадає на список <ul>
taskList.addEventListener('click', deleteAndEditTask);
// запускаємо функцію після кліку на кнопку "Видалити всі елементи"
clearBtn.addEventListener('click', removeAllTasks);
// запускаємо функцію filterTasks після того як ввідпускаємо клавішу (тоді, коли фокус в інпуті "Пошук завдань")
filter.addEventListener('keyup', filterTasks);
// editBtn.addEventListener('click', editTask);


function showPosts() {
    // оголошуємо змінну яка буде використовуватись для списку завдань
    let tasks;

    // перевіряємо чи є у localStorage вже якісь завдання
    if (localStorage.getItem('tasks') !== null) {
        // якщо вони там є - витягуємо їх і присвоюємо змінній
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        // якщо їх там нема - присвоюємо змінній значення порожнього масиву
        tasks = []
    }

    // для кожної задачі яка є
    tasks.forEach((task) => {
        // створюємо елемент списку
        const li = document.createElement('li');
        // додаємо йому класс
        li.classList.add('task');
        // всередині цього елементу списку додаємо опис завдання
        li.innerHTML = task;

        const bothIconsContainer = document.createElement('div');
		bothIconsContainer.className = 'both-icons-container';
		li.appendChild(bothIconsContainer);

        // сторюємо кнопку для видалення
        const button = document.createElement('button');
        // додаємо їй клас
        button.classList.add('remove-task');
        // всередину кнопку додаємо значення х
        button.innerHTML = 'x';
        // записуємо кнопку після всього, що є всередині елементу списку
        bothIconsContainer.append(button);

        const svg = document.createElement('button');
        svg.classList.add('edit');
        svg.innerHTML =  '/';
        bothIconsContainer.append(svg);
        
        // записуємо цей елемент в кінець списку
        taskList.append(li);
    })
}

// створюємо таску
function addTask(event) {
    // зупиняємо поведінку браузера за замовчуванням
    event.preventDefault();
    // отримуємо значення з інпута taskInput
    const value = taskInput.value;

    // якщо значення в інпуті порожнє  - то не додаємо нове завдання
    if (value.trim() === '') {
        return null;
    }

    // створюємо елемент списку
    const li = document.createElement('li');
    // додаємо йому класс
    li.classList.add('task');
    // всередині цього елементу списку додаємо опис завдання
    li.innerHTML = value;

    // сторюємо кнопку для видалення
    const button = document.createElement('button');
    // додаємо їй клас
    button.classList.add('remove-task');
    // всередину кнопку додаємо значення х
    button.innerHTML = 'x';
    // записуємо кнопку після всього, що є всередині елементу списку
    li.append(button);

    
    // сторюємо кнопку для редагування
    const svg = document.createElement('button');
    // додаємо їй клас
    svg.classList.add('edit');
    // всередину кнопки додаємо значення /
    svg.innerHTML = '/';
    // записуємо кнопку після всього, що є всередині елементу списку
    li.append(svg);

       
    // записуємо цей елемент в кінець списку
    taskList.append(li);

    // викликаємо функцію яка буде додавати завдання до Local Storage
    storeTasksInLocalStorage(value);
    // очищуємо вміст інпуту для створення завдання
    taskInput.value = '';
}

function storeTasksInLocalStorage(task) {
    // оголошуємо змінну яка буде використовуватись для списку завдань
    let tasks;

    // перевіряємо чи є у localStorage вже якісь завдання
    if (localStorage.getItem('tasks') !== null) {
        // якщо вони там є - витягуємо їх і присвоюємо змінній
        tasks = JSON.parse(localStorage.getItem('tasks'));
        // console.log(tasks)
    } else {
        // якщо їх там нема - присвоюємо змінній значення порожнього масиву
        tasks = []
    }

    // додаємо до списку нове завдання
    tasks.push(task);

    // зберігаємо список завданнь в Local Storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// видалити якусь конкретну таску

function deleteAndEditTask(event) {
    let tasks;
    let tasksArray = Array.from(taskList.childNodes);
    let iconContainter = event.target.parentElement;
    let taskByIndex = tasksArray.indexOf(iconContainter.closest('li'));
    // console.log(tasksArray);
    const editItem = event.target.parentElement.parentElement.firstChild.textContent;

        // console.log (editItem);
    // якщо ми клікнули по хрестику  - тоді
    if (event.target.classList.contains('remove-task')) {
        // пересвідчуємось чи юзер справді хоче видалити цей елемент
        if(confirm('Ви впевнені що хочете видалити цей елемент?')) {
            // видаляємо цей елемент списку, в якому знаходиться хрестик
            event.target.parentElement.parentElement.remove();
            // викликаємо функцію яка буде видаляти завдання з Local Storage
            removeTaskFromLocalStorage(event.target.parentElement.parentElement);
        }
    }
    if (event.target.classList.contains('edit')) {
        const editTask =  prompt('Виможете відредагувати дане завдання:', editItem);
        event.target.parentElement.parentElement.firstChild.textContent = editTask;

        editTaskInLocalStorage(taskByIndex, editTask);
            } 
        }

       
function editTaskInLocalStorage(taskByIndex, editTask) {
    let tasks;

    // перевіряємо чи є у localStorage вже якісь завдання
    if (localStorage.getItem('tasks') !== null) {
        // якщо вони там є - витягуємо їх і присвоюємо змінній
        tasks = JSON.parse(localStorage.getItem('tasks'));
        // console.log(tasks) 
    } else {
        // якщо їх там нема - присвоюємо змінній значення порожнього масиву
        tasks = []
    }
    if(editTask) {
		tasks.splice(taskByIndex, 1, editTask);
	}

	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskAll) {
   // оголшуємо змінну яка буде використовуватись для списку завдань
   let tasks;
   tasks = JSON.parse(localStorage.getItem('tasks'));
   tasks.splice(taskAll, 1);
   localStorage.setItem("tasks", JSON.stringify(tasks));

   // фільтруємо таски і повертаємо ті, які проходять умову
    const filteredTasks = tasks.filter((task) => {
        let taskElement;
        if(task !== taskElement.firstChild.textContent) {
            return task
        }
    })

    // запусиємо нові задачі в Local Storage
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}


// видалити всі таски
function removeAllTasks() {
    if(confirm('Ви впевнені що хочете видалити всі елементи?')) {
        // видаляємо весь контент всередині списку
        taskList.innerHTML = '';
        // видалити всі елементи з Local Storage
        removeAllTaskFromLocalStorage();
    }
}

function removeAllTaskFromLocalStorage() {
    // чистимо Local Storage
    localStorage.clear()
}

function filterTasks(event) {
    // отримуємо всі елементи списку
    const itemList = document.querySelectorAll('.task');
    // отримуємо значення інпуту "Пошук завдань" і робимо його в нижньому регістрі
    const searchQuery = event.target.value.toLowerCase();

    // проходимось по кожному елементу завдань
    itemList.forEach((item) => {
        // отримуємо текст завдання
        const itemValue = item.firstChild.textContent.toLowerCase();
        
        // перевіряємо чи текст завдання має в собі значення інпута "Пошук завдань"
        if (itemValue.includes(searchQuery)) {
            // якщо має, то display = list-item
            item.style.display = 'list-item';
        } else {
            // якщо ні - ховаємо це елемент списку
            item.style.display = 'none';
        }
    })
}


