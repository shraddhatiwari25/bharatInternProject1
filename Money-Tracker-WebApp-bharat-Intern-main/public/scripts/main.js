// Function to update the transaction list
function updateTransactionList() {
    
    fetch('/api/transactions')
        .then(response => response.json())
        .then(transactions => {
            const transactionList = document.getElementById('transactionList');

       
            transactionList.innerHTML = '';

          
            transactions.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${transaction.description}</td>
                    <td>${transaction.amount}</td>
                    <td>${transaction.type}</td>
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                `;
                transactionList.appendChild(row);
            });

            console.error('data success:', transactionList);
        })
        .catch(error => {
            console.error('Error fetching transaction data:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {


    const transactionForm = document.getElementById('transactionForm');
    const transactionList = document.getElementById('transactionList');

  
  
    transactionForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const type = document.getElementById('type').value;
        const date = document.getElementById('date').value; 

console.log('Date:', date);

        try {
           
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description,
                    amount,
                    type,
                    date, 
                }),
            });

           
            const result = await response.json();
            alert(result.message);

          
            transactionForm.reset();

        
            updateTransactionList();
        } catch (error) {
            console.error('Error submitting transaction:', error);
        }
    });
    

    
    // Function to fetch and display transactions
    function fetchTransactions() {
        fetch('/api/transactions')
            .then(response => response.json())
            .then(data => {
                
                transactionList.innerHTML = '';

                
                data.forEach(transaction => {
                    const listItem = document.createElement('tr');

                    // listItem.textContent = `Description : ${transaction.description} , Amount : ${transaction.amount}, Type : ${transaction.type}`;
                    // transactionList.appendChild(listItem);

                    listItem.innerHTML = `   <td>${transaction.description}</td>
                                     <td>${transaction.amount}</td>
                                     <td>${transaction.type}</td>
                                     <td>${transaction.date}</td>`
                    transactionList.appendChild(listItem);

                });

            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
            });
    }

    // Initial fetch to load transactions on page load
    fetchTransactions();

    const analysisButton = document.getElementById('analysisButton');

   
analysisButton.addEventListener('click', async function () {
    try {
        
        const selectedMonth = document.getElementById('selectedMonth').value;

       
        const response = await fetch(`/api/transactions?selectedMonth=${selectedMonth}`);
        const transactions = await response.json();

       
        const monthlyAnalysis = {
            income: 0,
            expense: 0,
        };

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                monthlyAnalysis.income += transaction.amount;
            } else if (transaction.type === 'expense') {
                monthlyAnalysis.expense += transaction.amount;
            }
        });

       
        const balance = monthlyAnalysis.income - monthlyAnalysis.expense;

        
        const analysisResultElement = document.getElementById('analysisResult');
        analysisResultElement.innerHTML = `
            <p>Total Balance: <h3 style="color: black;">Rs. ${balance.toFixed(2)} </h3></p>
            <h4 style="color: red;"> Income: Rs.${monthlyAnalysis.income.toFixed(2)} </h4>
            <h4 style="color: green;">  Expense: Rs. ${monthlyAnalysis.expense.toFixed(2)} </h4> `;  
            // <p>Month: ${selectedMonth}</p>
    } catch (error) {
        console.error('Error fetching transaction data:', error);
    }
});

    updateTransactionList();
});


function generateCalendar(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const calendarBody = document.getElementById("calendarBody");
    calendarBody.innerHTML = '';

    let date = 1;
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || date > daysInMonth) {
          row.innerHTML += "<td></td>";
        } else {
          row.innerHTML += `<td>${date}</td>`;
          date++;
        }
      }
      calendarBody.appendChild(row);
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    document.getElementById("currentMonthYear").textContent = `<<     ${monthNames[month]} - ${year}     >>`;
  }

  const currentDate = new Date();
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());



  