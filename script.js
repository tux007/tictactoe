let fields = [null, "circle", null, null, null, null, "cross", null, null];

function init() {
  render();
}

function render() {
  let table = "<table>";
  for (let row = 0; row < 3; row++) {
    table += "<tr>";
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      let symbol = "";
      if (fields[index] === "circle") symbol = getAnimatedCircleSVG();
      if (fields[index] === "cross") symbol = getAnimatedCrossSVG();
      table += `<td>${symbol}</td>`;
    }
    table += "</tr>";
  }
  table += "</table>";
  document.getElementById("content").innerHTML = table;
}

function getAnimatedCircleSVG() {
  return `
<svg width="70" height="70" viewBox="0 0 70 70">
  <circle
    cx="35"
    cy="35"
    r="30"
    fill="none"
    stroke="#00B0EF"
    stroke-width="8"
    stroke-dasharray="188.4"
    stroke-dashoffset="188.4"
  >
    <animate
      attributeName="stroke-dashoffset"
      from="188.4"
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
<svg width="70" height="70" viewBox="0 0 70 70">
  <line
    x1="15" y1="15"
    x2="55" y2="55"
    stroke="#FFC000"
    stroke-width="8"
    stroke-linecap="round"
    stroke-dasharray="56.57"
    stroke-dashoffset="56.57">
    <animate
      attributeName="stroke-dashoffset"
      from="56.57"
      to="0"
      dur="0.4s"
      fill="freeze"
    />
  </line>
  <line
    x1="55" y1="15"
    x2="15" y2="55"
    stroke="#FFC000"
    stroke-width="8"
    stroke-linecap="round"
    stroke-dasharray="56.57"
    stroke-dashoffset="56.57">
    <animate
      attributeName="stroke-dashoffset"
      from="56.57"
      to="0"
      dur="0.4s"
      begin="0.4s"
      fill="freeze"
    />
  </line>
</svg>
    `;
}
