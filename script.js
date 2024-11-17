// Seleciona os elementos do formulário

const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista

const expenseList = document.querySelector("ul");
const expensesTotal = document.querySelector("aside header h2");
const expensesQuantity = document.querySelector("aside header p span");

//Observa o evento do input, toda as vezes que o valor do input mudar, ele vai executar a função
amount.oninput = () =>{
  // Vamos fazer a validação do input, para que o usuário só possa digitar números

  let value = amount.value.replace(/\D/g, "");

  //Transformar o valor em centavos (exemplo: 150/100 = 1.50 que é equivalente a R$ 1,50 reais)

  value = Number(value) / 100

  // Atualiza o valor do input com o valor formatado

  amount.value = formatCurrencyBRL(value);
}


function formatCurrencyBRL(value){
  // Formata o valor no padrão brasileiro (BRL)

  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Retorna o valor formatado

  return value
}

// Captura o evento de submit do formulário para obter os dados do formulário

form.onsubmit = (event) => {
  // Previne o comportamento padrão de recarregar a pagina 
  event.preventDefault();

  // Cria um objeto com os detalhes na nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options [category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }
  
  // Chama a funçao que irá adicionar o item na lista 
  expenseAdd(newExpense);
}

// Função que irá adicionar o item na lista

function expenseAdd(newExpense){
  try {
    // Cria oi elemento para adicionar o item (li) na lista (ul)

    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");


    // Cria o icone da categoria

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);


    // Cria a info da despesa

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");


    // Cria o nome da despesa 

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense

    //Cria a categoria da despesa

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name

    //Adiciona name e categoty na div das informações da despesa

    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`


    //cria o icone de excluir
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "Remover");

    //Adiciona as informações no item
    
    expenseItem.append(expenseIcon, expenseInfo,expenseAmount,removeIcon);


    // Adiciona o item na lista
    
    expenseList.append(expenseItem);

    // Limpa o formulário para adicionar um novo item
    
    formClear();

    // Atualiza os totais 

    updateTotals();


  } catch (error) {
    alert("Não foi possivel atualizar a despesa");
    console.log(error)
  }
}

// Atualizar os totais

function updateTotals (){
  try {

    // Recupera todos os itens (li) da lista (ul)

    const items = expenseList.children
    
    // Atualiza a quantidade de itens da lista

    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // Variavel para incrementar o total

    let total = 0;

    // Percorre cada item(li) da lista (ul)
    for(let item = 0; item < items.length; item++){

      const itemAmount = items [item].querySelector(".expense-amount");

      // Remove caracteres não numéricos e substituir a vírgula por ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

      // Converte o valor para float
      value = parseFloat(value);

      // Verificar se é um numero válido
      if(isNaN(value)){ 
        return alert("Valor inválido");
      }


      // Incrementa o total

      total += Number(value);

    }

    // Criar a span para adicionar o R$ formatado

    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    // Formata o valor e remove o R$ que será exibido pela small com um estilo
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpa o conteudo do elemento

    expensesTotal.innerHTML = ""

    // Adiciona o simbolo da moeda e o valor total formatado 
    expensesTotal.append(symbolBRL, total);

  }catch (error) {
    console.log(error)
    alert("Não foi possivel atualizar os totais");
  }
}

// Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function(event){

  // Verifica se o elemento clicado é o icone de excluir


  if(event.target.classList.contains("remove-icon")){

    //Obtem a li pai do elemento clicado

    const item = event.target.closest(".expense");
   
   //Remove o item da lista
    item.remove()

    
  }
  // Atualiza os totais

  updateTotals()
})

function formClear (){

  //Liimpa os inputs

  expense.value = "";
  category.value = "";
  amount.value = "";

  //Coloca o foco no primeiro input
  
  expense.focus();
}