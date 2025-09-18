$(function(){ 
$.get("https://dummyjson.com/c/aa37-4ea7-408a-b3ad", function(dati){
    
  const prodotti = dati.products;
   const contenitoreApi = document.getElementById("datiApi");
        prodotti.forEach(prodotto => {
            const col= document.createElement("div");
            col.classList.add("col-sm-6","col-md-4","col-xl-3","mb-3");
            const card = document.createElement("div");
       card.classList.add("card", "p-2", "h-70");
            card.innerHTML = 
    `<img src="${prodotto.thumbnail}" class="foto card-img-top" alt="${prodotto.title}">
        <div class="card-body">
           <h5 class="card-title fs-2" style="font-family: 'Monotype Corsiva',cursive ; ">${prodotto.title}</h5>
             <p class="card-text">${prodotto.description}
            </p>
        </div>
        <div class="card-footer">
          <h4 class="prezzo text-center">Prezzo: €${prodotto.price}</h4>
        </div>
       <div style="display: flex; gap: 10px;">
            <button class="btn aggiungi" style="background-color: #edd8e6; padding: 5px 10px; font-size: 14px;">Aggiungi al carrello
            </button>
            <button class="btn rimuovi" style="background-color: #f0b8de; padding: 5px 10px; font-size: 14px;">Rimuovi Articolo
            </button>
       </div>`;
            col.appendChild(card);
            contenitoreApi.appendChild(col);
    });
    
}).fail(function(){
    alert("Errore nel caricamento dei dati!");
  });
});

$(function() {
  $(document).on("click", ".rimuovi", function() {
    $(this).closest(".card").fadeOut("normal");
  });
    
});
const carrello = [];

function aggiornaCarrello() {
  const container = $("#carrello-container");
  container.empty();

  if (carrello.length === 0) {
    container.html("<p>Il carrello è vuoto.</p>");
    return;
  }

 let totale = 0;

  carrello.forEach((prodotto, index) => {
  const prezzoNumerico = parseFloat(prodotto.price) * prodotto.quantita;
  totale += prezzoNumerico;

  const item = $(`
    <div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${prodotto.thumbnail}" class="img-fluid rounded-start" alt="${prodotto.title}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${prodotto.title}</h5>
            <p class="card-text">${prodotto.description}</p>
            <p class="card-text">Prezzo unitario: €${prodotto.price}</p>
           <div style="display: flex; align-items: center; gap: 10px;">
  ${
    prodotto.quantita === 0
      ? `<button class="btn btn-outline-danger btn-sm elimina-definitivo" data-index="${index}">
            <i class="fa fa-trash"></i>
         </button>`
      : `<button class="btn btn-outline-secondary btn-sm decrementa" data-index="${index}">-</button>`
  }
  <span>${prodotto.quantita}</span>
  <button class="btn btn-outline-secondary btn-sm incrementa" data-index="${index}">+</button>
</div>
          </div>
        </div>
      </div>
    </div>
  `);
  container.append(item);
});
    const totaleHtml = $(`
    <div class="mt-3">
      <h5 class="text-end"><strong>Totale: €${totale.toFixed(2)}</strong></h5>
    </div>
  `);
  container.append(totaleHtml);
}

$(document).on("click", ".aggiungi", function () {
  const card = $(this).closest(".card");
  const prodotto = {
    title: card.find(".card-title").text(),
    description: card.find(".card-text").text(),
    price: card.find(".prezzo").text().replace("Prezzo: €", ""),
    thumbnail: card.find("img").attr("src"),
    quantita: 1
  };

  Swal.fire({
    title: "Sicuro?",
    text: "Vuoi aggiungere al carrello?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sì, aggiungi!"
  }).then((result) => {
    if (result.isConfirmed) {
      carrello.push(prodotto);
      aggiornaCarrello();
      Swal.fire("Aggiunto!", "Il prodotto è nel carrello.", "success");
    }
  });
});

$(document).on("click", ".rimuovi-dal-carrello", function () {
      Swal.fire({
    title: "Sicuro?",
    text: "Vuoi eliminare l'articolo dal carrello?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sì, elimina!"
  }).then((result) => {
    if (result.isConfirmed) {
         const index = $(this).data("index");
  carrello.splice(index, 1);
  aggiornaCarrello();
    Swal.fire("Eliminato!","", "success");
    }
 
   
  });
});
$(document).on("click", ".incrementa", function () {
  const index = $(this).data("index");
  carrello[index].quantita++;
  aggiornaCarrello();
});

$(document).on("click", ".decrementa", function () {
  const index = $(this).data("index");
  if (carrello[index].quantita > 0) {
    carrello[index].quantita--;
  }
  aggiornaCarrello();
});

$(document).on("click", ".elimina-definitivo", function () {
  const index = $(this).data("index");
  Swal.fire({
    title: "Sei sicuro?",
    text: "Vuoi rimuovere questo prodotto dal carrello?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sì, rimuovi!",
    cancelButtonText: "Annulla"
  }).then((result) => {
    if (result.isConfirmed) {
      carrello.splice(index, 1);
      aggiornaCarrello();
      Swal.fire("Rimosso!", "Il prodotto è stato eliminato.", "success");
    }
  });
});

$(function(){
    $("#rimostra").on("click", function(){
        $(".card").show();
    });
});

 $(function(){
     $("#tabella").bootstrapTable({
    url:"utenti.json",
    columns: [
       // {field: "emoji", title: "Emoji", sortable: true},
        {field: "Id", title: "ID", sortable: true},
        {field: "nome", title: "Nome"},
        //{field: "email", title: "Email"},
        {field: "recensione", title: "Recensioni"}
    ]
 });
$("#tabella").addClass("table-light");
$("#tabella thead").addClass("table-danger");
     
   $("#tabella").on("click-row.bs.table", function(e,row){
        $("#modal-Id").text(row.Id);
        $("#modal-emoji").text(row.emoji);
        $("#modal-nome-cognome").text(`${row.nome} ${row.cognome}`);
       $("#modal-recensione").text(row.recensione);
        $("#modal-voto").text(row.voto);
         const modal = new bootstrap.Modal(document.getElementById("dettaglioModal"))
    modal.show();
    }); 
   });

//pagina logIn
document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();
  const nome = document.querySelector("input[type='text']").value;
  const password = document.querySelector("input[type='password']").value;

  if (nome === "admin" && password === "Admin1234") {
    window.location.href = "index.html";
  } else {
    Swal.fire({
      icon: "error",
      title: "Accesso negato",
      text: "Nome utente o password errati"
    });
  }
    const check = document.getElementById("check");
if (!check.checked) {
  Swal.fire("Devi accettare i termini e condizioni!");
  return;
}
});
document.getElementById("togglePassword").addEventListener("click", function () {
  const passwordInput = document.getElementById("password");
  const icon = this;

  const isPasswordVisible = passwordInput.type === "text";
  passwordInput.type = isPasswordVisible ? "password" : "text";
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
});
const passwordInput = document.getElementById("password");
const passwordHelp = document.getElementById("passwordHelp");
const form = document.getElementById("loginForm");

function validatePassword(password) {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  return hasUppercase && hasLowercase && hasNumber && hasMinLength;
}

passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;
  if (!validatePassword(password)) {
    passwordHelp.textContent = "La password deve contenere almeno 8 caratteri,\n una lettera maiuscola, una minuscola e un numero.";
  } else {
    passwordHelp.textContent = "";
  }
});

form.addEventListener("submit", function (event) {
  const password = passwordInput.value;

  if (!validatePassword(password)) {
    event.preventDefault(); 
    passwordHelp.textContent = "Correggi la password prima di procedere.";
    passwordInput.focus();
  }
});
