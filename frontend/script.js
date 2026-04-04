// script.js

function resetApp() {
    // Hide all sections
    document.getElementById("namesSection").classList.add("hidden");
    document.getElementById("matrixSection").classList.add("hidden");
    document.getElementById("resultSection").classList.add("hidden");

    // Clear their content
    document.getElementById("namesSection").innerHTML = "";
    document.getElementById("matrixSection").innerHTML = "";
    document.getElementById("resultList").innerHTML = "";

    // Clear number of people input
    document.getElementById("numPeople").value = "";
}

// Step 1: Create name inputs after entering number of people
function createInputs() {
    const n = parseInt(document.getElementById("numPeople").value);

    if (!n || n <= 0) {
        alert("Please enter a valid number of people");
        return;
    }

    const namesSection = document.getElementById("namesSection");
    namesSection.innerHTML = "<h2>Enter Names</h2>";
    namesSection.classList.remove("hidden");

    for (let i = 0; i < n; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Person ${i + 1}`;
        input.id = `name${i}`;
        namesSection.appendChild(input);
        namesSection.appendChild(document.createElement("br"));
        namesSection.appendChild(document.createElement("br"));
    }

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next";
    nextBtn.onclick = createMatrix;
    namesSection.appendChild(nextBtn);

    const resetBtn = document.createElement("button");
    resetBtn.innerText = "Reset";
    resetBtn.style.marginLeft = "10px"; // space from Next button
    resetBtn.onclick = resetApp;
    namesSection.appendChild(resetBtn);
}

// Step 2: Create transaction matrix after entering names
function createMatrix() {
    const n = parseInt(document.getElementById("numPeople").value);

    // Validate names are entered
    const names = [];
    for (let i = 0; i < n; i++) {
        const name = document.getElementById(`name${i}`).value.trim();
        if (!name) {
            alert(`Please enter a name for person ${i + 1}`);
            return;
        }
        names.push(name);
    }

    const matrixSection = document.getElementById("matrixSection");
    matrixSection.innerHTML = "<h2>Enter Transaction Matrix</h2><p>(Amount person i owes person j)</p>";
    matrixSection.classList.remove("hidden");

    const table = document.createElement("table");

    for (let i = 0; i < n; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < n; j++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.value = 0;
            input.id = `cell${i}${j}`;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    matrixSection.appendChild(table);
    matrixSection.appendChild(document.createElement("br"));

    const calcBtn = document.createElement("button");
    calcBtn.innerText = "Calculate";
    calcBtn.onclick = () => calculate(names, n); // pass names and n
    matrixSection.appendChild(calcBtn);

    const resetBtn2 = document.createElement("button");
    resetBtn2.innerText = "Reset";
    resetBtn2.style.marginLeft = "10px";
    resetBtn2.onclick = resetApp;
    matrixSection.appendChild(resetBtn2);
}

// Step 3: Calculate optimized transactions
function calculate(names, n) {
    // Read matrix
    const graph = [];
    for (let i = 0; i < n; i++) {
        graph[i] = [];
        for (let j = 0; j < n; j++) {
            graph[i][j] = parseInt(document.getElementById(`cell${i}${j}`).value) || 0;
        }
    }

    // Calculate net amounts for each person
    const net = new Array(n).fill(0);
    for (let p = 0; p < n; p++) {
        for (let i = 0; i < n; i++) {
            net[p] += graph[i][p] - graph[p][i];
        }
    }

    // Helper functions
    const getMaxCredit = () => net.indexOf(Math.max(...net));
    const getMaxDebit = () => net.indexOf(Math.min(...net));

    const result = [];

    function minimize() {
        const maxCred = getMaxCredit();
        const maxDebt = getMaxDebit();

        if (net[maxCred] === 0 && net[maxDebt] === 0) return;

        const amount = Math.min(-net[maxDebt], net[maxCred]);

        net[maxCred] -= amount;
        net[maxDebt] += amount;

        result.push(`${names[maxDebt]} pays ₹${amount} to ${names[maxCred]}`);

        minimize();
    }

    minimize();

    // Show results
const resultSection = document.getElementById("resultSection");
resultSection.classList.remove("hidden");

// Calculate total money SAFELY
let totalMoney = 0;
result.forEach(r => {
    const match = r.match(/₹(\d+)/);
    if (match) {
        totalMoney += parseInt(match[1]);
    }
});

// Build UI
resultSection.innerHTML = `
    <h2>Optimized Transactions</h2>
    <p><b>Total Transactions:</b> ${result.length}</p>
    <p><b>Total Money Transferred:</b> ₹${totalMoney}</p>
    <ul id="resultList"></ul>
`;

// Add list items
const resultList = document.getElementById("resultList");

result.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r;
    resultList.appendChild(li);
});
    // Scroll to results
    resultSection.scrollIntoView({ behavior: "smooth" });
}
