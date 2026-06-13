const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

function showError(inputId, errId, hasError) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);

  if (hasError) {
    input.classList.add('error');
    input.classList.remove('valid');
    err.classList.add('show');
  } else {
    input.classList.remove('error');
    input.classList.add('valid');
    err.classList.remove('show');
  }
}

function validateName() {
  const value = document.getElementById('name').value.trim();
  const isValid = value.length >= 2;
  showError('name', 'nameErr', !isValid);
  return isValid;
}

function validateEmail() {
  const value = document.getElementById('email').value.trim();
  const isValid = emailRegex.test(value);
  showError('email', 'emailErr', !isValid);
  return isValid;
}

function validatePhone() {
  const value = document.getElementById('phone').value.trim();

  if (value === '') {
    document.getElementById('phone').classList.remove('error', 'valid');
    document.getElementById('phoneErr').classList.remove('show');
    return true;
  }

  const digits  = value.replace(/\s+/g, '');
  const isValid = phoneRegex.test(digits);
  showError('phone', 'phoneErr', !isValid);
  return isValid;
}

function validateSubject() {
  const value = document.getElementById('subject').value;
  const err   = document.getElementById('subjectErr');

  if (!value) {
    err.classList.add('show');
    return false;
  }
  err.classList.remove('show');
  return true;
}

function validateMessage() {
  const value   = document.getElementById('message').value.trim();
  const isValid = value.length >= 10;
  showError('message', 'messageErr', !isValid);
  return isValid;
}

document.getElementById('name').addEventListener('input', validateName);
document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('phone').addEventListener('input', validatePhone);
document.getElementById('message').addEventListener('input', validateMessage);

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const allValid =
    validateName()    &
    validateEmail()   &
    validatePhone()   &
    validateSubject() &
    validateMessage();

  if (allValid) {
    const banner = document.getElementById('formSuccess');
    banner.classList.add('show');

    this.reset();
    document.querySelectorAll('#contactForm input, #contactForm textarea')
      .forEach(el => el.classList.remove('valid', 'error'));

    setTimeout(() => banner.classList.remove('show'), 4000);
  }
});

document.getElementById('resetBtn').addEventListener('click', function () {
  document.getElementById('contactForm').reset();
  document.querySelectorAll('.err-msg').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('#contactForm input, #contactForm textarea')
    .forEach(el => el.classList.remove('valid', 'error'));
});


let todos = [
  { id: 1, text: 'Learn Flexbox layout',    done: false },
  { id: 2, text: 'Build contact form',      done: true  },
  { id: 3, text: 'Add JS validation',       done: false },
  { id: 4, text: 'Make it responsive',      done: false },
];

let currentFilter = 'all';
let nextId = 5;

document.getElementById('addTodoBtn').addEventListener('click', addTodo);

document.getElementById('todoInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addTodo();
});

function addTodo() {
  const input = document.getElementById('todoInput');
  const text  = input.value.trim();
  if (!text) return;

  todos.push({ id: nextId++, text: text, done: false });
  input.value = '';
  renderTodos();
}

function toggleTodo(id) {
  const task = todos.find(t => t.id === id);
  if (task) task.done = !task.done;
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  renderTodos();
}

document.querySelectorAll('.filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentFilter = this.dataset.filter;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    renderTodos();
  });
});

document.getElementById('clearDoneBtn').addEventListener('click', function () {
  todos = todos.filter(t => !t.done);
  renderTodos();
});

function renderTodos() {
  const list = document.getElementById('todoList');
  list.innerHTML = '';

  const filtered = todos.filter(function (t) {
    if (currentFilter === 'active') return !t.done;
    if (currentFilter === 'done')   return t.done;
    return true;
  });

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'todo-empty';
    empty.textContent = 'No tasks here yet.';
    list.appendChild(empty);
  } else {
    filtered.forEach(function (task) {
      const li = document.createElement('li');
      li.className = 'todo-item' + (task.done ? ' done' : '');

      const check = document.createElement('div');
      check.className = 'todo-check' + (task.done ? ' done' : '');
      check.addEventListener('click', function () { toggleTodo(task.id); });

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = task.text;

      const del = document.createElement('button');
      del.className = 'todo-delete';
      del.textContent = '✕';
      del.title = 'Delete task';
      del.addEventListener('click', function () { deleteTodo(task.id); });

      li.appendChild(check);
      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  const remaining = todos.filter(t => !t.done).length;
  document.getElementById('todoCount').textContent =
    remaining + (remaining === 1 ? ' task left' : ' tasks left');

  const hasDone = todos.some(t => t.done);
  document.getElementById('clearDoneBtn').style.display = hasDone ? 'inline-flex' : 'none';
}

renderTodos();


document.getElementById('imgUpload').addEventListener('change', function () {
  const files = Array.from(this.files);

  files.forEach(function (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      insertImage(e.target.result);
    };

    reader.readAsDataURL(file);
  });

  this.value = '';
});

document.getElementById('sampleBtn').addEventListener('click', addSampleImages);

document.getElementById('clearGalleryBtn').addEventListener('click', function () {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '<div class="gallery-empty" id="galleryEmpty">No images yet. Upload or load samples.</div>';
});

function insertImage(src) {
  const grid  = document.getElementById('galleryGrid');
  const empty = document.getElementById('galleryEmpty');

  if (empty) empty.remove();

  const item = document.createElement('div');
  item.className = 'gallery-item';

  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Gallery image';

  const del = document.createElement('button');
  del.className = 'del-img';
  del.textContent = '✕';
  del.title = 'Remove image';

  del.addEventListener('click', function () {
    item.remove();

    if (!grid.querySelector('.gallery-item')) {
      grid.innerHTML = '<div class="gallery-empty" id="galleryEmpty">No images yet. Upload or load samples.</div>';
    }
  });

  item.appendChild(img);
  item.appendChild(del);
  grid.appendChild(item);
}

const SAMPLE_URLS = [
  'https://picsum.photos/seed/apex1/200/200',
  'https://picsum.photos/seed/apex2/200/200',
  'https://picsum.photos/seed/apex3/200/200',
  'https://picsum.photos/seed/dev4/200/200',
  'https://picsum.photos/seed/code5/200/200',
  'https://picsum.photos/seed/web6/200/200',
];

function addSampleImages() {
  SAMPLE_URLS.forEach(function (url) {
    insertImage(url);
  });
}