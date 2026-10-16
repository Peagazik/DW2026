const cursos = [
  {
    id: 1,
    nome: "HTML e CSS",
    descricao: "Aprenda a estrutura",
    cargaHoraria: 40,
    ativo: true,
    categoria: "Frontend",
  },
  {
    id: 2,
    nome: "javaScript",
    descricao: "Aprenda a programar",
    cargaHoraria: 40,
    ativo: true,
    categoria: "Backend",
  },
  {
    id: 3,
    nome: "Flutter",
    descricao: "Aprenda a programar Flutter",
    cargaHoraria: 60,
    ativo: false,
    categoria: "Frontend",
  },
];

const listaCursos = document.querySelector("#listaCursos");
const btnTodos = document.querySelector("#btnTodos");
const btnAtivos = document.querySelector("#btnAtivos");

function renderizarCursos(lista) {
  listaCursos.innerHTML = "";

  lista.forEach((curso) => {
    const card = `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                            <span class="badge text-bg-dark align-self-start mb-3">
                                ${curso.categoria}
                            </span>
                            <h3 class="h5 card-title">
                                ${curso.nome}
                            </h3>  
                            <p class="card-text text-secondary">
                                ${curso.descricao}
                            </p>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <small class="text-secondary">
                                        ${curso.cargaHoraria}
                                    </small>
                                    <span class="badge ${curso.ativo ? "text-bg-sucess" : "text-bg-secondary"} ">
                                        ${curso.ativo ? "Ativo" : "Em breve"}
                                    </span>
                                </div>
                            </div>  
                            
                    </div>  
                </div>          
            </div>  
        `;
    listaCursos.insertAdjacentHTML("beforeend", card);
  });
}

renderizarCursos(cursos);

function mostrarCursosAtivos() {
  const cursosAtivos = cursos.filter((curso) => curso.ativo);
  renderizarCursos(cursosAtivos);
}

function mostrarTodos() {
  renderizarCursos(cursos);
}

btnTodos.addEventListener("click", () => {
  mostrarTodos();
  btnTodos.classList.remove("btn-outline-primary");
  btnTodos.classList.add("btn-primary");
  btnAtivos.classList.remove("btn-primary");
  btnAtivos.classList.add("btn-outline-primary");
});

btnAtivos.addEventListener("click", () => {
  mostrarCursosAtivos();
  btnAtivos.classList.remove("btn-outline-primary");
  btnAtivos.classList.add("btn-primary");
  btnTodos.classList.remove("btn-primary");
  btnTodos.classList.add("btn-outline-primary");
});
