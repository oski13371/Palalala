// Dane logowania
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

// Sprawdź, czy jesteśmy na stronie admina
if (window.location.pathname.includes("admin.html")) {
  const loginSection = document.getElementById("loginSection");
  const adminPanel = document.getElementById("adminPanel");
  const postList = document.getElementById("postList");

  window.login = function() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      loginSection.classList.add("hidden");
      adminPanel.classList.remove("hidden");
      loadPostsAdmin();
    } else {
      alert("Nieprawidłowy login lub hasło!");
    }
  };

  window.addPost = function() {
    const title = document.getElementById("postTitle").value.trim();
    const content = document.getElementById("postContent").value.trim();
    const imageInput = document.getElementById("postImage");
    if (!title || !content) {
      alert("Wpisz tytuł i treść!");
      return;
    }

    let image = "";
    if (imageInput.files.length > 0) {
      const file = imageInput.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        image = e.target.result;
        savePost(title, content, image);
      };
      reader.readAsDataURL(file);
    } else {
      savePost(title, content, image);
    }
  };

  function savePost(title, content, image) {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.unshift({ title, content, image, date: new Date().toLocaleString() });
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPostsAdmin();
    alert("Post dodany!");
  }

  function loadPostsAdmin() {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    postList.innerHTML = posts.map((p, i) => `
      <div style="border-bottom:1px solid #ddd;padding:0.5rem 0;">
        <b>${p.title}</b> (${p.date})
        <button onclick="deletePost(${i})" style="float:right;">Usuń</button>
      </div>
    `).join("");
  }

  window.deletePost = function(index) {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPostsAdmin();
  };
}

// Strona główna
if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  const container = document.getElementById("postsContainer");
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");

  if (posts.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>Brak postów. Dodaj coś w panelu admina!</p>";
  } else {
    container.innerHTML = posts.map(p => `
      <div class="post">
        ${p.image ? `<img src="${p.image}" alt="obrazek">` : ""}
        <div class="post-content">
          <h2>${p.title}</h2>
          <p>${p.content}</p>
          <small>${p.date}</small>
        </div>
      </div>
    `).join("");
  }
}
