let listaDeCompras = [];
let itemAEditar;

const form = document.getElementById("form-itens");
const inputItem = document.getElementById("receber-item");
const ulItem = document.getElementById("lista-de-itens");
const ulItensComprados = document.getElementById("itens-comprados");
const listaRecuperada = localStorage.getItem("listaDeCompras");

function atualizarLocalStorage() {
  localStorage.setItem('listaDeCompras', JSON.stringify(listaDeCompras));
}

if(listaRecuperada) {
  listaDeCompras = JSON.parse(listaRecuperada);
  mostrarItens();
}

form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  salvarItem();
  mostrarItens();
  inputItem.focus();
});

function salvarItem() {
  const item = inputItem.value;
  const checarDuplicado = listaDeCompras.some(
    (elemento) => elemento.valor.toLowerCase() === item.toLowerCase()
  );

  if (checarDuplicado) {
    alert("Item já adicionado!");
    return;
  } else {
    // dessa forma cria um clone do objeto (array)
    listaDeCompras.push({
      valor: item,
      checar: false, // metodo pra alterar o valor para true quando for clicado no input, ajuda a manipular o DOM
    });
  }
  inputItem.value = "";
}

function mostrarItens() {
  ulItem.innerHTML = "";
  ulItensComprados.innerHTML = "";

  listaDeCompras.forEach((elemento, index) => {
    if (elemento.checar) {
      ulItensComprados.innerHTML += `
      <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
            <input type="checkbox" checked class="is-clickable" />  
            <span class="itens-comprados is-size-5">${elemento.valor}</span>
        </div>
        <div>
            <i class="fa-solid fa-trash is-clickable deletar"></i>
        </div>
    </li>`;
    } else {
      ulItem.innerHTML += `
        <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
            <div>
                <input type="checkbox" class="is-clickable" />
                <input type="text" class="is-size-5" value="${elemento.valor}" ${index !== Number(itemAEditar) ? 'disabled' : ''}></input>
            </div>
            <div>
                ${index === Number(itemAEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
                <i class="fa-solid fa-trash is-clickable deletar"></i>
            </div>
        </li>
        `;
    }
  });

  const inputsCheck = document.querySelectorAll('input[type="checkbox"]');

  inputsCheck.forEach((i) => {
    i.addEventListener("click", (evento) => {
      const valorElemento =
        evento.target.parentElement.parentElement.getAttribute("data-value");
      // para alterar de false para true: = evento.target.checked;
      listaDeCompras[valorElemento].checar = evento.target.checked;
      mostrarItens();
    });
  });

  const deletarObjetos = document.querySelectorAll(".deletar");

  deletarObjetos.forEach((i) => {
    i.addEventListener("click", (evento) => {
      const valorElemento =
        evento.target.parentElement.parentElement.getAttribute("data-value");
      listaDeCompras.splice(valorElemento, 1);
      mostrarItens();
    });
  });

  const editarItens = document.querySelectorAll(".editar");

  editarItens.forEach((i) => {
    i.addEventListener("click", (evento) => {
      itemAEditar =
        evento.target.parentElement.parentElement.getAttribute("data-value");
      mostrarItens();
    });
  });

  atualizarLocalStorage();
}

function salvarEdicao() {
  const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`);
  console.log(itemEditado.value);
  listaDeCompras[itemAEditar].valor = itemEditado.value;
  console.log(listaDeCompras);
  itemAEditar = -1;
  mostrarItens();
}