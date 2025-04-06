let portfolio = [];
let selectedBuy = null;

window.onload = function () {
  const crt = document.getElementById("chart").getContext("2d");
  let currentPrice = 100;
  const labels = [];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Prices",
        data: [],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      animation: false,
      maintainAspectRatio: false,
      responsive: false,
      scales: {
        x: { display: false },
        y: { beginAtZero: false },
      },
    },
  };

  const stockChart = new Chart(crt, config);

  function updateChart() {
    const now = new Date().toLocaleTimeString();
    labels.push(now);
    if (labels.length > 30) labels.shift();

    const changePercent = (Math.random() * 2 - 1) / 100;
    currentPrice += currentPrice * changePercent;
    currentPrice = Math.round(currentPrice * 100) / 100;

    data.datasets[0].data.push(currentPrice);
    if (data.datasets[0].data.length > 30) data.datasets[0].data.shift();

    stockChart.update();
    renderPortfolio();
  }

  setInterval(updateChart, 3000);

  document.getElementById("chart").onclick = function (evt) {
    const points = stockChart.getElementsAtEventForMode(
      evt,
      "nearest",
      { intersect: true },
      false
    );

    if (points.length) {
      const point = points[0];
      const label = stockChart.data.labels[point.index];
      const value =
        stockChart.data.datasets[point.datasetIndex].data[point.index];

      selectedBuy = { time: label, price: value };
      document.getElementById(
        "buyText"
      ).innerText = `Buy at ${label} for ₹${value}?`;

      const popup = document.getElementById("buyPopup");
      const padding = 10;
      let x = evt.clientX;
      let y = evt.clientY;

      if (x + popup.offsetWidth > window.innerWidth) {
        x = window.innerWidth - popup.offsetWidth - padding;
      }
      if (y + popup.offsetHeight > window.innerHeight) {
        y = window.innerHeight - popup.offsetHeight - padding;
      }

      popup.style.left = `${x}px`;
      popup.style.top = `${y}px`;
      popup.style.display = "block";
    }
  };

  window.confirmBuy = function () {
    if (selectedBuy) {
      const price = selectedBuy.price;
      if (price > 102) {
        alert(`Stock is overpriced! It is not advised to purchase.`);
      } else if (price < 98) {
        alert(`Stock is relatively cheap! It is a good time to purchase.`);
      }

      portfolio.push(selectedBuy);
      alert(`✅ Bought at ${selectedBuy.time} for ₹${selectedBuy.price}`);
      selectedBuy = null;
      renderPortfolio();
    }
    closePopup();
  };

  window.closePopup = function () {
    document.getElementById("buyPopup").style.display = "none";
  };

  function getCurrentPrice() {
    return data.datasets[0].data[data.datasets[0].data.length - 1] || 0;
  }

  function renderPortfolio() {
    const tbody = document.querySelector("#portfolioTable tbody");
    tbody.innerHTML = "";

    const current = getCurrentPrice();

    portfolio.forEach((stock, index) => {
      const profit = (current - stock.price).toFixed(2);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${stock.time}</td>
        <td>${stock.price}</td>
        <td style="color:${profit >= 0 ? "green" : "red"}">₹${profit}</td>
      `;
      tbody.appendChild(row);
    });
  }
};
