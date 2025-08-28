let linhasPesquisa = [];
let linhaDetalhes = [];
/*Essa função carrega nossos 2 CSVs essenciais, o Pesquisa.csv, que contém informações sobre as doenças, 
e o Detalhes.csv, que contém informações detalhadas sobre cada doença. Usamos um split por ";" e chamamos
a função renderTabela para printar as linhas da nossa tabela*/
async function carregarCSV() {
  try {
    const response = await fetch("Pesquisa.csv");
    const response2 = await fetch("Detalhes.csv");
    const conteudo = await response.text();
    const conteudo2 = await response2.text();

    linhasPesquisa = conteudo.trim().split("\n").map(l => l.split(";"));
    linhaDetalhes = conteudo2.trim().split("\n").map(l => l.split(";"));

    renderTabela(linhasPesquisa);
  } catch (error) {
    console.error("Erro ao carregar CSV:", error);
  }
}

/* Essa função busca detalhes de uma doença específica no arquivo Detalhes.csv, essa função é essencial
para mostrar informações adicionais sobre cada doença quando o usuário clica na linha correspondente. */
function buscarDetalhes(nome) {
  for (let i = 1; i < linhaDetalhes.length; i++) {
    if (linhaDetalhes[i][0] === nome) {
      return linhaDetalhes[i][1]; 
    }
  }
  return null;
}
/*Essa função descreve o funcionamento da barra de pesquisa, colocamos o interpretador de texto para buscar
os termos digitados pelo usuário e filtrar as linhas da tabela com base nesses termos, e usamos o toLowerCase()
para padronizar a pesquisa e facilitar a procura do usuário, também usamos um filter para aplicar a busca. */
document.getElementById("pesquisa").addEventListener("input", function() {
  const termo = this.value.toLowerCase().trim();

  if (!termo) {
    renderTabela(linhasPesquisa);
    return;
  }

  const termosBusca = termo.split(",").map(t => t.trim());

  const filtradas = linhasPesquisa.filter((linha, index) => {
    if (index === 0) return true;
    const textoLinha = linha.join(" ").toLowerCase();
    return termosBusca.every(t => textoLinha.includes(t));
  });

  renderTabela(filtradas);
});


/* Essa função renderiza a tabela com as linhas fornecidas, dentro dela temos a criação da estrutura da tabela HTML 
é nela também que conseguimos aplicar a lógica de exibição dos detalhes das doenças fazendo uso da função buscarDetalhes 
para mostrar ao usuário as informações adicionais sobre cada doença, usamos uma lógica de exibição condicional, já que
os detalhes só devem aparecer quando o usuário clica na linha correspondente. Nela também temos o eventListener de clique
e por fim, nela chamamos a função pintarLinhasComRisco para aplicar a coloração nas linhas com base no risco. Resumindo
todas as funcionalidades de busca e exibição de detalhes estão interligadas para proporcionar uma experiência de usuário 
mais rica e informativa.
*/
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

    const detalhes = document.createElement("tr");
    detalhes.style.display = "none";
    const tdDetalhes = document.createElement("td");
    tdDetalhes.colSpan = linhas[0].length;

    const nomeDoenca = linhas[i][0];
    const infoDetalhes = buscarDetalhes(nomeDoenca);

    tdDetalhes.innerHTML = infoDetalhes
      ? `<strong>Detalhes:</strong> ${infoDetalhes}`//Essa linha diz que o o detalhes vai tentar pegar os detalhes de infoDetalhes, se não conseguir ele vai mostrar "Sem detalhes cadastrados."
      : "Sem detalhes cadastrados.";

    detalhes.appendChild(tdDetalhes);

    tr.addEventListener("click", () => {
      detalhes.style.display = detalhes.style.display === "none" ? "table-row" : "none";
    });

    tbody.appendChild(tr);
    tbody.appendChild(detalhes);
  }

  tabela.appendChild(thead);
  tabela.appendChild(tbody);
  container.appendChild(tabela);

  pintarLinhasComRisco();
}

/*Essa função usa um esquema de cores para identificar o nível de risco associado a cada doença e mostrar ao usuário
as informações relevantes de forma visual, ela usa uma ideia de identificadores, que vão de 1 a 5, onde 5 representa
o maior risco e 2 o menor, tendo também o 1 quando o risco depende de fatores externos. */
function pintarLinhasComRisco() {
  const linhas = document.querySelectorAll("tbody tr");

  linhas.forEach(linha => {
    const primeiraCelula = linha.querySelector("td:first-child");
    if (primeiraCelula) {
      const conteudoDoenca = primeiraCelula.textContent.trim();
      const ultimoCaractere = conteudoDoenca.charAt(conteudoDoenca.length - 1);

      linha.classList.remove("potencialmente-fatal","doenca-grave","cronica-controlavel","aguda-menor-gravidade","dependem-fatores");

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
//Carregando a tabela e mostrando-a, ao usuário
carregarCSV();
