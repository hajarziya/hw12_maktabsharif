const form = document.querySelector(".form");
const btnSubmit = document.querySelector(".btn__submit");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const date = document.querySelector("#date");
const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get("taskId");

async function delay(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(form).entries());
  if (taskId) {
    editData(taskId, formData);
  } else {
    await postData(formData);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (taskId) {
    btnSubmit.textContent = "Save";
    fetch(`http://localhost:5000/tasks/${taskId}`)
      .then((response) => response.json())
      .then((response) => {
        if (response.id) {
          title.value = response.title;
          description.value = response.description;
          date.value = response.dueDate;
        } else {
          window.location.href = "/src/home";
        }
      });
  }
});

const postData = async function (data) {
  Toastify({
    text: "Task added successfully",
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "left",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();

  await delay(1);

  const information = await fetch("http://localhost:5000/tasks", {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDone: false,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (information.ok) {
    window.location.href = "/src/tasks";
  }
};

const editData = async function (id, data) {
  Toastify({
    text: "Task edited successfully",
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "left",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();

  await delay(1);
  const information = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      updatedAt: new Date(),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (information.ok) {
    window.location.href = "/src/tasks";
  }
};
