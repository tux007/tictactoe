let fields = [null, null, null, null, null, null, null, null, null];
let currentShape = "circle";

function init() {
  render();
}

function render() {
  // Turn indicator oben anzeigen
  renderTurnIndicator();

  // Tabelle in einen Wrapper legen
  let table = '<div class="table-wrapper"><table>';
  for (let row = 0; row < 3; row++) {
    table += "<tr>";
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      let symbol = "";
      if (fields[index] === "circle") symbol = getAnimatedCircleSVG();
      if (fields[index] === "cross") symbol = getAnimatedCrossSVG();
      // onclick nur, wenn Feld leer ist
      let onclick =
        fields[index] === null ? `onclick="handleClick(${index}, this)"` : "";
      table += `<td ${onclick}>${symbol}</td>`;
    }
    table += "</tr>";
  }
  table += "</table></div>";
  document.getElementById("content").innerHTML = table;
}

function renderTurnIndicator() {
  // Beide Symbole anzeigen, das aktive bekommt die Klasse "active"
  const circleActive = currentShape === "circle" ? "active" : "";
  const crossActive = currentShape === "cross" ? "active" : "";
  document.getElementById("turn-indicator").innerHTML = `
    <div class="turn-symbol circle ${circleActive}" title="Kreis ist am Zug">
      <svg width="48" height="48" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="25" fill="none" stroke="#00B0EF" stroke-width="8"/>
      </svg>
    </div>
    <div class="turn-symbol cross ${crossActive}" title="Kreuz ist am Zug">
      <svg width="48" height="48" viewBox="0 0 60 60">
        <line x1="15" y1="15" x2="45" y2="45" stroke="#FFC000" stroke-width="8" stroke-linecap="round"/>
        <line x1="45" y1="15" x2="15" y2="45" stroke="#FFC000" stroke-width="8" stroke-linecap="round"/>
      </svg>
    </div>
  `;
}

function handleClick(index, tdElement) {
  // Setze das Feld auf das aktuelle Symbol
  fields[index] = currentShape;
  // Füge das SVG direkt ins Feld ein
  if (currentShape === "circle") {
    tdElement.innerHTML = getAnimatedCircleSVG();
  } else {
    tdElement.innerHTML = getAnimatedCrossSVG();
  }
  // Entferne das onclick-Attribut
  tdElement.onclick = null;
  // Prüfe, ob das Spiel vorbei ist
  const winInfo = checkGameOver();
  if (winInfo) {
    drawWinAnimation(winInfo);
  } else {
    // Wechsel das Symbol für den nächsten Zug
    currentShape = currentShape === "circle" ? "cross" : "circle";
  }
  // Nach jedem Zug den Turn-Indicator neu rendern
  renderTurnIndicator();
}

// Prüft, ob das Spiel vorbei ist und gibt ggf. die Gewinn-Kombination zurück
function checkGameOver() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Reihen
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Spalten
    [0, 4, 8],
    [2, 4, 6], // Diagonalen
  ];
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      return { indices: pattern, winner: fields[a] };
    }
  }
  return null;
}

// Zeichnet eine weiße Linie über die Gewinn-Kombination
function drawWinLine(winInfo) {
  // Zellmitten berechnen (jede Zelle 80x80, Mitte +40)
  const cellCenters = [
    { x: 40, y: 40 }, // Zelle 0
    { x: 120, y: 40 }, // Zelle 1
    { x: 200, y: 40 }, // Zelle 2
    { x: 40, y: 120 }, // Zelle 3
    { x: 120, y: 120 }, // Zelle 4
    { x: 200, y: 120 }, // Zelle 5
    { x: 40, y: 200 }, // Zelle 6
    { x: 120, y: 200 }, // Zelle 7
    { x: 200, y: 200 }, // Zelle 8
  ];

  // Finde die Felder der Gewinnkombination
  const indices = winInfo.indices;
  const winner = winInfo.winner;

  // Finde das erste und letzte Feld mit dem Gewinner-Symbol in der Gewinnkombination
  let firstIdx = null;
  let lastIdx = null;
  for (let i = 0; i < indices.length; i++) {
    if (fields[indices[i]] === winner) {
      if (firstIdx === null) firstIdx = indices[i];
      lastIdx = indices[i];
    }
  }

  // Falls keine passenden Felder gefunden wurden, Standardverhalten
  if (firstIdx === null || lastIdx === null) {
    firstIdx = indices[0];
    lastIdx = indices[2];
  }

  const start = cellCenters[firstIdx];
  const end = cellCenters[lastIdx];

  // Füge das SVG-Overlay als Kind von .table-wrapper ein (zentriert über der Tabelle)
  const svgLine = `
    <svg class="win-line" width="240" height="240">
      <line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="#fff" stroke-width="10" stroke-linecap="round"/>
    </svg>
  `;
  const wrapper = document.querySelector(".table-wrapper");
  const oldLine = wrapper.querySelector(".win-line");
  if (oldLine) oldLine.remove();
  wrapper.insertAdjacentHTML("beforeend", svgLine);
}

function drawWinAnimation(winInfo) {
  // Füge der Gewinnkombination eine Klasse hinzu und starte die Animation
  const indices = winInfo.indices;
  // Hole alle TDs der Tabelle
  const wrapper = document.querySelector(".table-wrapper");
  const tds = wrapper.querySelectorAll("td");
  indices.forEach((idx) => {
    const td = tds[idx];
    td.classList.add("win-cell");
  });
}

function getAnimatedCircleSVG() {
  return `
<svg width="60" height="60" viewBox="0 0 60 60">
  <circle
    cx="30"
    cy="30"
    r="25"
    fill="none"
    stroke="#00B0EF"
    stroke-width="8"
    stroke-dasharray="157"
    stroke-dashoffset="157"
  >
    <animate
      attributeName="stroke-dashoffset"
      from="157"
      to="0"
      dur="0.8s"
      fill="freeze"
    />
  </circle>
</svg>
    `;
}

function getAnimatedCrossSVG() {
  return `
<svg width="60" height="60" viewBox="0 0 60 60">
  <line
    x1="15" y1="15"
    x2="45" y2="45"
    stroke="#FFC000"
    stroke-width="8"
    stroke-linecap="round"
    stroke-dasharray="42.43"
    stroke-dashoffset="42.43">
    <animate
      attributeName="stroke-dashoffset"
      from="42.43"
      to="0"
      dur="0.4s"
      fill="freeze"
    />
  </line>
  <line
    x1="45" y1="15"
    x2="15" y2="45"
    stroke="#FFC000"
    stroke-width="8"
    stroke-linecap="round"
    stroke-dasharray="42.43"
    stroke-dashoffset="42.43">
    <animate
      attributeName="stroke-dashoffset"
      from="42.43"
      to="0"
      dur="0.4s"
      begin="0.4s"
      fill="freeze"
    />
  </line>
</svg>
    `;
}

function restartGame() {
  fields = [null, null, null, null, null, null, null, null, null];
  currentShape = "circle";
  renderTurnIndicator();
  render();
}
