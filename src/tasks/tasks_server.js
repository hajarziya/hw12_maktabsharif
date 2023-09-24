const box = document.querySelector(".container__tasks");
const tasksList = document.querySelector(".tasks__list");
const pagination = document.querySelector(".pagination");
const btnDelete = document.querySelector("#btn__delete");
const btnEdit = document.querySelector("#btn__edit");
const limit = 5;
const page = 1;

const getData = async function (page) {
  const getInfo = await fetch(
    `http://localhost:5000/tasks?_page=${page}&_limit=${limit}`
  );
  const totalCount = getInfo.headers.get("X-Total-Count");
  const data = await getInfo.json();
  return { data, totalCount };
};

function creatTask(data, totalPage, currentPage) {
  tasksList.innerHTML = "";
  data.forEach((item) => {
    const html = `
    <div class="task__box">
      <div class="task__box--content">
        <div class="task__box--title">
          <label class="check__container">
            <input class="checkbox_input" type="checkbox">
            <span class="checkmark"></span>
          </label>
          <span class="title">${item.title}</span>
          <span class="date">${item.date} </span>
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
  });
  const pages = Array.from(
    { length: totalPage },
    (_, index) => index + 1
  ).reverse();

  pagination.innerHTML = "";
  pages.forEach((page) => {
    const html = `<button class="pagination_btn ${
      page == currentPage && "active_btn"
    }" id=page_${page}>${page}</button>`;
    pagination.insertAdjacentHTML("afterbegin", html);
  });
  document.querySelectorAll(".pagination_btn").forEach((button) => {
    button.addEventListener("click", () => {
      const clickedPage = parseInt(button.textContent);
      if (currentPage !== clickedPage) {
        currentPage = clickedPage;
        getDataAndRender(currentPage);
      }
    });
  });

  document.querySelectorAll(".btn__delete").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.id;
      console.log("delete " + id);

      deleteTask(id);
    });
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

async function getDataAndRender(page) {
  const { data, totalCount } = await getData(page);
  const totalPage = Math.ceil(totalCount / limit);
  creatTask(data, totalPage, page);
}

getDataAndRender(1);
