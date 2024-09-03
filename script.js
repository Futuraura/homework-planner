let taskGroups = {};
let currentGroup = null;

document.getElementById('newGroupBtn').addEventListener('click', function() {
    const newGroupInput = document.getElementById('newGroupName');
    newGroupInput.style.display = 'block';
    newGroupInput.focus();
});

document.getElementById('newGroupName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const groupName = this.value.trim();
        if (groupName) {
            addGroup(groupName);
            this.value = '';
            this.style.display = 'none';
        }
    }
});

function addGroup(groupName) {
    if (!taskGroups[groupName]) {
        taskGroups[groupName] = [];
        const groupBtn = document.createElement('button');
        groupBtn.textContent = groupName;
        groupBtn.type = 'button';
        groupBtn.addEventListener('click', () => selectGroup(groupName));
        document.getElementById('groupContainer').appendChild(groupBtn);
        selectGroup(groupName);
    }
}

function selectGroup(groupName) {
    currentGroup = groupName;
    updateTaskDisplay();
}

document.getElementById('addTaskButton').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskName = taskInput.value.trim();
    if (taskName && currentGroup) {
        taskGroups[currentGroup].push(taskName);
        taskInput.value = '';
        updateTaskDisplay();
    }
}

function updateTaskDisplay() {
    const tasksContainer = document.getElementById('tasksContainer');
    tasksContainer.innerHTML = '';
    if (currentGroup && taskGroups[currentGroup]) {
        taskGroups[currentGroup].forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.textContent = task;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => removeTask(index));
            taskElement.appendChild(removeBtn);
            tasksContainer.appendChild(taskElement);
        });
    }
}

function removeTask(index) {
    if (currentGroup) {
        taskGroups[currentGroup].splice(index, 1);
        updateTaskDisplay();
    }
}

document.getElementById('homeworkForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const dateGiven = new Date(document.getElementById('dateGiven').value);
    let dueDate = new Date(document.getElementById('dueDate').value);
    dueDate.setDate(dueDate.getDate());

    const timeDiff = dueDate - dateGiven;
    const daysAvailable = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Distribute tasks across available days
    for (let groupName in taskGroups) {
        const tasks = taskGroups[groupName];
        for (let i = 0; i < daysAvailable; i++) {
            const currentDay = new Date(dateGiven);
            currentDay.setDate(currentDay.getDate() + i);
            const dateString = `${currentDay.getFullYear()}-${currentDay.getMonth() + 1}-${currentDay.getDate()}`;

            if (!assignments[dateString]) {
                assignments[dateString] = [];
            }

            const tasksForTheDay = tasks.slice(i * Math.ceil(tasks.length / daysAvailable), (i + 1) * Math.ceil(tasks.length / daysAvailable));
            assignments[dateString] = assignments[dateString].concat(tasksForTheDay.map(task => `${groupName}: ${task}`));
        }
    }

    updateCalendar();
    this.reset();
    taskGroups = {};
    currentGroup = null;
    document.getElementById('groupContainer').innerHTML = '<button type="button" id="newGroupBtn">New Group</button>';
    document.getElementById('tasksContainer').innerHTML = '';
});

let assignmentId = 0;

function addAssignment(dateString, assignment) {
    if (!assignments[dateString]) {
        assignments[dateString] = [];
    }
    assignments[dateString].push({ id: assignmentId++, text: assignment });
    updateCalendar();
}

function showAssignments(year, month, day) {
    const dateString = `${year}-${month + 1}-${day}`;
    const popup = document.getElementById('assignmentPopup');
    const popupDate = document.getElementById('popupDate');
    const assignmentList = document.getElementById('assignmentList');

    popupDate.textContent = new Date(year, month, day).toDateString();
    assignmentList.innerHTML = '';

    if (assignments[dateString] && assignments[dateString].length > 0) {
        assignments[dateString].forEach((assignment) => {
            const li = document.createElement('li');
            li.textContent = assignment.text;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-assignment');
            removeButton.addEventListener('click', () => removeAssignment(dateString, assignment.id));
            li.appendChild(removeButton);
            assignmentList.appendChild(li);
        });
    } else {
        assignmentList.innerHTML = '<li>No assignments for this day</li>';
    }

    popup.style.display = 'block';
}

function removeAssignment(dateString, id) {
    if (assignments[dateString]) {
        assignments[dateString] = assignments[dateString].filter(a => a.id !== id);
        if (assignments[dateString].length === 0) {
            delete assignments[dateString];
        }
        showAssignments(...dateString.split('-').map(Number));
        updateCalendar();
    }
}document.addEventListener('DOMContentLoaded', function() {
    const subtitle = document.getElementById('subtitle');
    let subtitleText = [
        "You are Mark. You are Mark. You are Mark. You are Mark. You are Mark. You are Mark. You are Mark.",
        "Fuck off calendars!",
        "Calendars aren't eating a penny from me!",
        "Hello, You are Mark. No worries this is normal amnesia.",
        "You need to do your homework, you know that right? RIGHT?!",
        "Shut the fuck up and go studying!",
        "Bruh when is the summer gonna start?",
        "Programming stuff starts in the next quarter there is not much time left; I hope.",
        "You are a fucking idiot, you know that right? RIGHT?!",
    ];

    subtitle.textContent = subtitleText[Math.floor(Math.random() * subtitleText.length)];
});

const backgrounds = [];

document.addEventListener('DOMContentLoaded', async function() {
    const sideMenu = document.getElementById('sideMenu');
    
    try {
        const response = await fetch('backgrounds/');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href.match(/\.(jpg|jpeg|png|gif)$/i)) {
                backgrounds.push(`${href}`);
            }
        });
        
        backgrounds.forEach((bg, index) => {
            const backgroundOption = document.createElement('div');
            backgroundOption.className = 'background-option';
            backgroundOption.style.backgroundImage = `url('${bg}')`;
            backgroundOption.onclick = () => changeBackground(bg);
            sideMenu.appendChild(backgroundOption);
        });

        // Pick a random background by default
        if (backgrounds.length > 0) {
            const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            changeBackground(randomBackground);
        }
    } catch (error) {
        console.error('Error fetching backgrounds:', error);
    }
});

let isthemeSelectorOpen = false;

function togglethemeSelector() {
    const themeSelector = document.getElementById('themeSelector');
    themeSelector.classList.toggle('open');
}

document.getElementById('themeButton').addEventListener('click', togglethemeSelector);

function changeBackground(backgroundUrl) {
    document.body.style.backgroundImage = `url('${backgroundUrl}')`;
}

function addAssignment(dateString, assignment) {
    if (!assignments[dateString]) {
        assignments[dateString] = [];
    }
    assignments[dateString].push(assignment);
    updateCalendar();
}

function removeAssignment(dateString, index) {
    if (assignments[dateString] && assignments[dateString].length > index) {
        assignments[dateString].splice(index, 1);
        if (assignments[dateString].length === 0) {
            delete assignments[dateString];
        }
        updateCalendar();
    }
}

  const calendar = document.getElementById('calendar');
  const monthYear = document.getElementById('monthYear');
  const calendarDays = document.getElementById('calendarDays');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');

  let currentDate = new Date();
  let assignments = {};

  function generateCalendar(year, month) {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDay = firstDay.getDay();

      monthYear.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;

      calendarDays.innerHTML = '';

      for (let i = 0; i < startingDay; i++) {
          calendarDays.innerHTML += '<div class="day-cube"></div>';
      }

      for (let day = 1; day <= daysInMonth; day++) {
          const dayCube = document.createElement('div');
          dayCube.classList.add('day-cube');
      
          const dayNumber = document.createElement('div');
          dayNumber.classList.add('day-number');
          dayNumber.textContent = day;
      
          const dayAssignments = document.createElement('div');
          dayAssignments.classList.add('day-assignments');
      
          dayCube.appendChild(dayNumber);
          dayCube.appendChild(dayAssignments);
      
          if (year === currentDate.getFullYear() && month === currentDate.getMonth() && day === currentDate.getDate()) {
              dayCube.classList.add('today');
          }
                  const dateString = `${year}-${month + 1}-${day}`;
                  if (assignments[dateString] && assignments[dateString].length > 0) {
                      dayCube.classList.add('has-assignment');
                  }
      
                  dayCube.addEventListener('click', () => showAssignments(year, month, day));
      
                  calendarDays.appendChild(dayCube);
              }
          }

        function removeAssignment(dateString, index) {
            if (assignments[dateString] && assignments[dateString].length > index) {
                assignments[dateString].splice(index, 1);
                if (assignments[dateString].length === 0) {
                    delete assignments[dateString];
                }
                updateAssignmentPopup(dateString);
                updateCalendar();
            }
        }

        function updateAssignmentPopup(dateString) {
            const assignmentList = document.getElementById('assignmentList');
            assignmentList.innerHTML = '';

            if (assignments[dateString] && assignments[dateString].length > 0) {
                assignments[dateString].forEach((assignment, index) => {
                    const li = document.createElement('li');
                    li.textContent = assignment;
                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.classList.add('remove-assignment');
                    removeButton.addEventListener('click', () => removeAssignment(dateString, index));
                    li.appendChild(removeButton);
                    assignmentList.appendChild(li);
                });
            } else {
                assignmentList.innerHTML = '<li>No assignments for this day</li>';
            }
        }

        function showAssignments(year, month, day) {
            const dateString = `${year}-${month + 1}-${day}`;
            const popup = document.getElementById('assignmentPopup');
            const popupDate = document.getElementById('popupDate');

            popupDate.textContent = new Date(year, month, day).toDateString();
            updateAssignmentPopup(dateString);

            popup.style.display = 'block';
        }
  function removeAssignment(dateString, index) {
      if (assignments[dateString] && assignments[dateString].length > index) {
          assignments[dateString].splice(index, 1);
          if (assignments[dateString].length === 0) {
              delete assignments[dateString];
          }
          showAssignments(...dateString.split('-').map(Number));
          updateCalendar();
      }
  }
  document.getElementById('closePopup').addEventListener('click', () => {
      document.getElementById('assignmentPopup').style.display = 'none';
  });

  // Add this to your existing code to close the popup when clicking outside
  window.addEventListener('click', (event) => {
      const popup = document.getElementById('assignmentPopup');
      if (event.target === popup) {
          popup.style.display = 'none';
      }
  });

  function addAssignment(year, month, day) {
      const assignment = prompt('Enter assignment for this day:');
      if (assignment) {
          const dateString = `${year}-${month + 1}-${day}`;
          if (!assignments[dateString]) {
              assignments[dateString] = [];
          }
          assignments[dateString].push(assignment);
          updateCalendar();
      }
  }
  function updateCalendar() {
      generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }

  prevMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendar();
  });

  updateCalendar();
