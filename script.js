// NÃO ESQUECER DE COMENTAR O CÓDIGO PARA ESTUDO!!!!!!

let linhasCSV = [];

async function carregarCSV() {
 try {
   const response = await fetch("Pesquisa.csv");
   const conteudo = await response.text();

   linhasCSV = conteudo.trim().split("\n").map(l => l.split(";"));

   renderTabela(linhasCSV);
 } catch (error) {
   console.error("Erro ao carregar CSV:", error);
 }
}

document.getElementById("pesquisa").addEventListener("input", function() {
 const termo = this.value.toLowerCase().trim();

 if (!termo) {
   renderTabela(linhasCSV);
   return;
 }

 const termosBusca = termo.split(";").map(t => t.trim());

 const filtradas = linhasCSV.filter((linha, index) => {
   if (index === 0) return true; 
   const textoLinha = linha.join(" ").toLowerCase();
   return termosBusca.every(t => textoLinha.includes(t));
 })

 renderTabela(filtradas);
});

function renderTabela(linhas) {
 const container = document.getElementById("tabela-container");
 container.innerHTML = "";

 const tabela = document.createElement("table");
 const thead = document.createElement("thead");
 const tbody = document.createElement("tbody");

 const cabecalho = document.createElement("tr");
 linhas[0].forEach(coluna => {
   const th = document.createElement("th");
   th.textContent = coluna;
   cabecalho.appendChild(th);
 });
 thead.appendChild(cabecalho);

 for (let i = 1; i < linhas.length; i++) {
   const tr = document.createElement("tr");
   linhas[i].forEach(valor => {
     const td = document.createElement("td");
     td.textContent = valor;
     tr.appendChild(td);
   });
   tbody.appendChild(tr);
 }

 tabela.appendChild(thead);
 tabela.appendChild(tbody);
 container.appendChild(tabela);

 pintarLinhasComRisco();
}


function pintarLinhasComRisco() {
  const linhas = document.querySelectorAll("tbody tr");
  
  linhas.forEach(linha => {
    const primeiraCelula = linha.querySelector("td:first-child");
    if (primeiraCelula) {
      const conteudoDoenca = primeiraCelula.textContent.trim(); 
      const ultimoCaractere = conteudoDoenca.charAt(conteudoDoenca.length - 1);
  
      linha.classList.remove("potencialmente-fatal", "doenca-grave", "cronica-controlavel", "aguda-menor-gravidade", "dependem-fatores");
      

      if (ultimoCaractere === "5") {
        linha.classList.add("potencialmente-fatal");
      } else if (ultimoCaractere === "4") {
        linha.classList.add("doenca-grave");
      } else if (ultimoCaractere === "3") {
        linha.classList.add("cronica-controlavel");
      } else if (ultimoCaractere === "2") {
        linha.classList.add("aguda-menor-gravidade");
      } else if (ultimoCaractere === "1") {
        linha.classList.add("dependem-fatores");
      }
    }
  });
}
carregarCSV();