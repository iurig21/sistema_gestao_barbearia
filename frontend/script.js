const username = document.getElementById("username");
const password = document.getElementById("password");
const loginForm = document.getElementById("login");
const error = document.getElementById("error");
const success = document.getElementById("success");
const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const registerForm = document.getElementById("register");
const titulo = document.getElementById("nome");
const conteudo = document.getElementById("conteudo");
const noticiasForm = document.getElementById("registerNoticia");
const tbody = document.querySelector("tbody");
const noticiasContainer = document.getElementById("noticias-container");

function checkAuth() {
  const token = localStorage.getItem("token");
  const currentPage = window.location.pathname;

  const protectedPages = ["/interna.html", "/noticias.html"];

  if (protectedPages.some((page) => currentPage.includes(page)) && !token) {
    window.location.href = "http://127.0.0.1:5500/index.html";
  }
}

checkAuth();

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!username.value.trim() || !password.value.trim()) {
    return (error.innerHTML = "Email and password are required");
  }

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "http://127.0.0.1:5500/loginerror.html";
        return;
      }
      throw new Error(
        data.message ?? `Response status code: ${response.status}`
      );
    }
    localStorage.setItem("token", data);
    window.location.href = "http://127.0.0.1:5500/interna.html";
  } catch (err) {
    console.error("Error loggin in :", err);
    error.innerHTML = err.message;
  }
});

registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!registerUsername.value.trim() || !registerPassword.value.trim()) {
    return (error.innerHTML = "Email and password are required");
  }

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: registerUsername.value,
        password: registerPassword.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ?? `Response status code: ${response.status}`
      );
    }

    success.innerHTML = data.message ?? "User created succesfully";
  } catch (err) {
    console.error("Error signing up :", err);
    error.innerHTML = err.message;
  }
});

noticiasForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const fileInput = document.getElementById("myfile");
  const file = fileInput?.files?.[0];

  if (
    file &&
    !file.type.startsWith("image/") &&
    file.type !== "application/pdf"
  ) {
    error.innerHTML = "Only image and pdfs files are allowed";
    success.innerHTML = "";
    return;
  }

  if (!titulo.value.trim() || !conteudo.value.trim()) {
    error.innerHTML = "Inputs are required";
    success.innerHTML = "";
    return;
  }

  try {
    const token = localStorage.getItem("token");

    // if a file is selected, upload it first
    let imagemFilename = null;
    if (file) {
      const formData = new FormData();
      formData.append("myfile", file);

      const uploadResp = await fetch("http://localhost:3000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadResp.json();
      if (!uploadResp.ok) {
        throw new Error(
          uploadData.message ?? `Upload failed: ${uploadResp.status}`
        );
      }

      imagemFilename = uploadData.filename;
    }

    const response = await fetch("http://localhost:3000/noticias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo: titulo.value,
        conteudo: conteudo.value,
        imagem: imagemFilename,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ?? `Response status code: ${response.status}`
      );
    }

    titulo.value = "";
    conteudo.value = "";
    error.innerHTML = "";
    success.innerHTML = data.message;

    fetchnoticias();
  } catch (err) {
    console.error("Error creating a new noticia:", err);
    error.innerHTML = err;
  }
});

async function fetchnoticias() {
  if (!tbody) return;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/noticias", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `Error: ${response.status}`);
    }

    const noticias = data[0];


    tbody.innerHTML = "";

    if (noticias.length === 0) {
      return (tbody.innerHTML = `<tr><td colspan='4'>Sem notícias encontradas </td></tr>`);
    }

    noticias.forEach((noticia) => {
      const row = document.createElement("tr");

      let fileDisplay = "";
      if (noticia.imagem) {
        const fileUrl = `http://localhost:3000/uploads/${noticia.imagem}`;
        if (noticia.imagem.toLowerCase().endsWith(".pdf")) {
          fileDisplay = `<a href="${fileUrl}" target="_blank">View PDF</a>`;
        } else {
          fileDisplay = `<img class="news-image" src="${fileUrl}"/>`;
        }
      }

      row.innerHTML = `
          <td>${noticia.titulo}</td>
          <td>${noticia.conteudo}</td>
          <td>${fileDisplay}</td>
          <td>
            <button onclick="deleteNoticia(${noticia.id})">Delete</button>
            <button onclick="changeFile(${noticia.id})">Change</button>
          </td>
        `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error fetching noticias:", err);
    tbody.innerHTML = `<tr><td colspan='5'>Error loading ficheiros</td></tr>`;
  }
}

if (tbody) {
  fetchnoticias();
}

if (noticiasContainer) {
  async function fetchNoticiasCards() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/noticias", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? `Error: ${response.status}`);
      }

      const noticias = data[0];

      noticiasContainer.innerHTML = "";

      if (noticias.length === 0) {
        noticiasContainer.innerHTML = `<p style="color: #a1a1aa; text-align: center; width: 100%;">Sem notícias encontradas</p>`;
        return;
      }

      noticias.forEach((noticia) => {
        const card = document.createElement("div");
        card.className = "card";

        let fileDisplay = "";
        if (noticia.imagem) {
          const fileUrl = `http://localhost:3000/uploads/${noticia.imagem}`;
          if (noticia.imagem.toLowerCase().endsWith(".pdf")) {
            fileDisplay = `<a href="${fileUrl}" target="_blank">View PDF</a>`;
          } else {
            fileDisplay = `<img src="${fileUrl}" alt="noticia image"/>`;
          }
        }

        card.innerHTML = `
          <h3>${noticia.titulo}</h3>
          <p>${noticia.conteudo}</p>
          ${fileDisplay}
        `;
        noticiasContainer.appendChild(card);
      });
    } catch (err) {
      console.error("Error fetching noticias:", err);
      noticiasContainer.innerHTML = `<p style="color: #f87171; text-align: center; width: 100%;">Error loading noticias</p>`;
    }
  }

  fetchNoticiasCards();
}

const Logout = () => {
  window.location.href = "http://127.0.0.1:5500/index.html";
  localStorage.removeItem("token");
};
