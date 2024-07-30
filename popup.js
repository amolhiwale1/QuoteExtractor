document.getElementById('extractShadowRoots').addEventListener('click', () => {
  extractAndFormat('Anchor.class');
});

document.getElementById('extractButtons').addEventListener('click', () => {
  extractAndFormat('Button.class');
});

document.getElementById('extractTextInputs').addEventListener('click', () => {
  extractAndFormat('TextInput.class');
});

document.getElementById('optimizeOutput').addEventListener('click', optimizeOutput);

document.getElementById('output').addEventListener('click', copyToClipboard);

function extractAndFormat(className) {
  const jsPath = document.getElementById('jsPathInput').value;
  const formattedOutput = formatJSPath(jsPath, className);
  displayOutput("return " + formattedOutput);
}

function formatJSPath(jsPath, className) {
  const parts = jsPath.match(/querySelector\("([^"]+)"\)/g).map(part => part.match(/"([^"]+)"/)[1]);
  const formattedParts = parts.slice(1).map(part => `    .shadowRootCreateByCss(WebComponent.class, "${part}")`);  // start from second element
  formattedParts[formattedParts.length - 1] = `    .shadowRootCreateByCss(${className}, "${parts[parts.length - 1]}");`;
  return `app().create().byCss(WebComponent.class, "${parts[0]}")\n${formattedParts.join('\n')}`;
}

function displayOutput(formattedOutput) {
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = `<pre>${formattedOutput}</pre>`;
}

function copyToClipboard() {
  const outputDiv = document.getElementById('output');
  const text = outputDiv.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const copyMessage = document.getElementById('copyMessage');
    copyMessage.style.display = 'block';
    setTimeout(() => {
      copyMessage.style.display = 'none';
    }, 2000);
  });
}

function optimizeOutput() {
  const outputDiv = document.getElementById('output');
  let output = outputDiv.innerText.trim(); 
  let optimizedOutput = output;


  const regex = /\.shadowRootCreateByCss\(WebComponent\.class, "main > sn-canvas-screen:nth-child\((\d)\)"\)/;
  const match = output.match(regex);

  if (match) {
    const number = match[1];
    optimizedOutput = output.split(match[0])[1];
    optimizedOutput = `return snCanvasScreen${number}_shadowRoot()${optimizedOutput}`;
  } else {
    const regexDefault = /\.shadowRootCreateByCss\(WebComponent\.class, "main > sn-canvas-screen"\)/;
    const matchDefault = output.match(regexDefault);
    if (matchDefault) {
      optimizedOutput = output.split(matchDefault[0])[1];
      optimizedOutput = `return snCanvasScreen_shadowRoot()${optimizedOutput}`;
    }
  }

  // Display optimized output only if it was modified
  if (optimizedOutput !== output) {
    displayOutput(optimizedOutput);
  } else {
    displayOutput("No optimization applied.");
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.add('loaded');
});



