const crudForm = document.querySelector(".crud-form");
const mainInput = crudForm["main-input"];
const coursesEl = document.querySelector(".courses");

function fix_main_input() {
  mainInput.value = "";
  mainInput.focus();
}

function remoev_el(...elements) {
  elements.forEach((el) => el.remove());
}

function show_courses() {
  coursesEl.innerHTML = "";
  const lsCourses = get_course_from_ls();
  if (lsCourses.length > 0) {
    lsCourses.forEach((course) => create_course(course));
  } else {
    coursesEl.innerHTML = "<p class='msg'>There Is No Courses To Show!</p>";
  }
}

show_courses();

function edit_course(courseEl, courseObj) {
  const editForm = document.createElement("form");
  editForm.className = "edit-form";

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = courseObj.title;
  editForm.appendChild(editInput);

  const submitInput = document.createElement("input");
  submitInput.type = "submit";
  submitInput.value = "Edit Course";
  editForm.appendChild(submitInput);

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (editInput.value !== "") {
      edit_course_from_ls(courseObj, editInput.value);
      show_courses();
      editForm.remove();
      courseEl.classList.remove("edited");
    } else {
      alert("Error => Empty Input!");
    }
  });

  courseEl.appendChild(editForm);
}

function create_course(courseObj) {
  const courseEl = document.createElement("div");
  courseEl.className = "course";

  const courseTitleEl = document.createElement("span");
  courseTitleEl.className = "course-title";
  courseTitleEl.innerHTML = courseObj.title;
  courseEl.appendChild(courseTitleEl);

  const editBtnEl = document.createElement("button");
  editBtnEl.className = "edit-btn action-btn";
  editBtnEl.innerHTML = "Edit Course";
  courseEl.appendChild(editBtnEl);

  const deleteBtnEl = document.createElement("button");
  deleteBtnEl.className = "delete-btn action-btn";
  deleteBtnEl.innerHTML = "Delete Course";
  courseEl.appendChild(deleteBtnEl);

  editBtnEl.addEventListener("click", function () {
    remoev_el(courseTitleEl, deleteBtnEl, editBtnEl);
    edit_course(courseEl, courseObj);
    courseEl.classList.add("edited");
    document.querySelectorAll(".course").forEach((c) => {
      c.classList.add("disabled");
    });
    courseEl.classList.remove("disabled");
  });

  deleteBtnEl.addEventListener("click", function () {
    remove_course_from_ls(courseObj);
    show_courses();
  });

  coursesEl.appendChild(courseEl);
}

crudForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (mainInput.value !== "") {
    const courseObj = {
      id: Math.random(),
      title: mainInput.value,
    };
    add_course_to_ls(courseObj);
    show_courses();
    fix_main_input();
  } else {
    alert("Error => Empty Input!");
  }
});

function add_course_to_ls(courseObj) {
  const lsCourses = get_course_from_ls();
  localStorage.setItem("course", JSON.stringify([...lsCourses, courseObj]));
}

function edit_course_from_ls(courseObj, newTitle) {
  const lsCourses = get_course_from_ls();
  let index = 0;
  lsCourses.forEach((course, i) => {
    if (JSON.stringify(course) === JSON.stringify(courseObj)) index = i;
  });
  lsCourses.splice(index, 1, { id: courseObj.id, title: newTitle });
  localStorage.setItem("course", JSON.stringify(lsCourses));
}

function remove_course_from_ls(courseObj) {
  const lsCourses = get_course_from_ls();
  localStorage.setItem(
    "course",
    JSON.stringify(lsCourses.filter((course) => course.id !== courseObj.id))
  );
}

function get_course_from_ls() {
  const lsCourses = JSON.parse(localStorage.getItem("course"));
  return localStorage.getItem("course") !== null ? lsCourses : [];
}
