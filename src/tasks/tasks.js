const box = document.querySelector(".container__tasks");
const tasksList = document.querySelector(".tasks__list");
const pagination = document.querySelector(".pagination");
const btnDelete = document.querySelector("#btn__delete");
const btnEdit = document.querySelector("#btn__edit");
const deletePanel = document.querySelector(".confirm__overlayer");
const btnDeleteYes = document.querySelector(".positive");
const btnDelteNo = document.querySelector(".negative");
const limit = 10;
let deleteItemId = 0;

const getData = async function () {
  const getInfo = await fetch(`http://localhost:5000/tasks`);
  const data = await getInfo.json();
  const totalCount = data.length;

  return { data, totalCount };
};

const urlParams = new URLSearchParams(window.location.search);
const page = urlParams.get("page");

if (page) {
  const { data, totalCount } = await getData();
  const totalPage = Math.ceil(totalCount / limit);

  const startIndex = (page - 1) * limit;
  const displayData = data.slice(startIndex, startIndex + limit).reverse();
  creatTask(displayData, totalPage, page);
} else {
  window.location.href = "/src/tasks/?page=1";
}

function creatTask(tasks, totalPage, currentPage) {
  tasksList.innerHTML = "";
  tasks.forEach((item) => {
    const html = `
    <div class="task__box">
      <div class="task__box--content">
        <div class="task__box--title">
          <label class="check__container">
            <input id=${item.id} class="checkbox_input" type="checkbox">
            <span class="checkmark"></span>
          </label>
          <span class="title">${item.title}</span>
          <span class="date">${item.dueDate} </span>
        </div>
        <div class="container__tasks--discription">
          <p class="discription">${item.description}</p>
        </div>
      </div>
      <div class="wrapper__btns">
        <button id="${item.id}" class="btn__delete">
          <ion-icon name="trash-outline"></ion-icon>
        </button>
        <a
          href="../home/index.html?taskId=${item.id}"
          id="${item.id}"
          class="btn__edit"
        >
          <ion-icon name="create-outline"></ion-icon
        ></a>
      </div>
    </div>`;
    tasksList.insertAdjacentHTML("afterbegin", html);
    const checkbox = document.querySelector(".checkbox_input");
    checkbox.checked = item.isDone;
  });
  const pages = Array.from(
    { length: totalPage },
    (_, index) => index + 1
  ).reverse();

  pagination.innerHTML = "";
  pages.forEach((_page) => {
    const html = `<button class="pagination_btn ${
      _page == currentPage && "active_btn"
    }" id=page_${_page}>${_page}</button>`;
    pagination.insertAdjacentHTML("afterbegin", html);
  });
  document.querySelectorAll(".pagination_btn").forEach((button) => {
    button.addEventListener("click", () => {
      const clickedPage = parseInt(button.textContent);
      if (currentPage !== clickedPage) {
        window.location.href = "/src/tasks/?page=" + clickedPage;
      }
    });
  });

  document.querySelectorAll(".checkbox_input").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const isDone = checkbox.checked;
      const id = checkbox.id;
      toggleDone(id, isDone);
    });
  });

  document.querySelectorAll(".btn__delete").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.id;
      deletePanel.style.display = "flex";
      deleteItemId = id;
    });
  });

  btnDeleteYes.addEventListener("click", () => {
    deleteTask(deleteItemId);
  });

  btnDelteNo.addEventListener("click", () => {
    deletePanel.style.display = "none";
  });

  async function deleteTask(id) {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      getDataAndRender(currentPage);
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
    }
  }
}

const toggleDone = async function (id, isDone) {
  try {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        isDone: isDone,
        updatedAt: new Date(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {}
};
