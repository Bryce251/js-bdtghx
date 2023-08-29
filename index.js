(async function () {
  const headElement = document.getElementsByTagName('head')[0];
  const bodyElement = document.getElementsByTagName('body')[0];
  const rootElement = document.createElement('jsconsole');
  const jsInputElement = document.createElement('input');
  const hideShowElement = document.createElement('button');
  const styleElement = document.createElement('style');

  jsInputElement.className = 'js';
  hideShowElement.className = 'js';
  hideShowElement.innerText = 'Hide/Show';

  styleElement.innerHTML = `
  jsconsole {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 22px;
    height: 35vh;

    background-color: rgb(10, 10, 10);

    z-index: 99999999999999999999;

    border: 3px gray solid;
    border-radius: 6px;

    display: flex;
    flex-direction: column;

    overflow: scroll;

    padding: 2px;
  }

  jsconsole.hide {
    display: none;
  }

  jsconsole span {
    font-family: "Courier New", Courier, monospace;
    color: white;
    opacity: 1;
    font-size: medium;
  }

  jsconsole .error {
    color: red;
  }

  jsconsole .warn {
    color: yellow;
  }

  jscontainer span {
    color: gray;
    font-family: "Courier New", Courier, monospace;
    opacity: 1;
    font-size: small;
  }
  
  jscontainer.open span {
    color: white;
  }

  jscontainer, jscontainer.open items {
    display: flex;
    flex-direction: row;
  }

  jscontainer.open, jscontainer.open items {
    flex-direction: column;
  }

  button.js {
    position: fixed;
    bottom: 0px;
    right: 0px; 
    opacity: 1;
    color: white;
    background-color: black;
    border: 0px;
    border-radius: 5px;
    padding: 3px;

    z-index: 999999999999999999999;
  }

  input.js {
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 68px;

    border: 2px gray solid;
    border-radius: 6px;

    background-color: #0a0a0a;
    color: white;
    z-index: 99999999999999999999;
  }
  `;

  let logItems = [];

  function createPreview(data, key) {
    let output = '';
    const keys = Object.keys(data);
    const cap = 9;

    for (let i = 0; i < Math.min(keys.length, cap); i++) {
      if (i == Math.min(keys.length, cap) - 1) {
        output += keys[i];
      } else {
        output += keys[i] + ', ';
      }
    }

    const keyDisp = `${key ? key + ': ' : ''}`;

    if (keys.length > cap) return `${output}...`;
    else return output;
  }

  function containerToggle(
    containerElement,
    toggleText,
    topText,
    items,
    data,
    k
  ) {
    if (containerElement.className == 'closed') {
      containerElement.className = 'open';

      /* Show root hash key */
      const keyDisp = `${k ? k + ': ' : ''}`;
      toggleText.innerText = `${keyDisp}▼`;
      topText.innerHTML = '';

      items.style.paddingLeft = `calc(${keyDisp.length} * 8px)`;

      /* Show */
      Object.keys(data).forEach((key) => {
        const el = processLog(data[key], key);
        items.append(el);
        rootElement.scrollTop = rootElement.scrollHeight;
      });
    } else {
      containerElement.className = 'closed';
      items.innerHTML = '';
      toggleText.innerText = `${k ? k + ': ' : ''}►`;
      topText.innerText = createPreview(data);
    }
  }

  function processLog(data, key) {
    const logElement = document.createElement('span');
    switch (typeof data) {
      case 'string':
      case 'number':
        const keyDisp = `${key ? key + ': ' : ''}`;
        logElement.innerText =
          keyDisp +
          (typeof data == 'string'
            ? data.replace(/(\?\:\\r\\n|\\r|\\n)/g, '<br>')
            : `${data}`);
        return logElement;
      case 'undefined':
        logElement.innerText = 'undefined';
        return logElement;
      case null:
        logElement.innerText = 'null';
        return logElement;
      case 'function':
        logElement.innerText = `${key}: Function()`;
        return logElement;
      case 'boolean':
        logElement.innerText = `${key}: ${data ? 'true' : 'false'}`;
        return logElement;
      default:
        const container = document.createElement('jscontainer');
        const text = document.createElement('span');
        const toggleText = document.createElement('span');
        const items = document.createElement('items');
        container.className = 'closed';
        toggleText.onclick = () => {
          containerToggle(container, toggleText, text, items, data, key);
        };

        toggleText.innerText = `${key ? key + ': ' : ''}►`;
        text.innerText = createPreview(data, key);

        container.append(toggleText);
        container.append(text);
        container.append(items);

        return container;
    }
  }

  console.log = (data) => {
    const logElement = processLog(data);
    logItems.push(logElement);

    rootElement.append(logElement);
  };

  console.error = (data) => {
    const logElement = document.createElement('span');
    logElement.className = 'error';
    logElement.innerHTML = data;
    logItems.push(logElement);

    rootElement.append(logElement);
  };

  console.warn = (data) => {
    const logElement = document.createElement('span');
    logElement.className = 'warn';
    logElement.innerHTML = data;
    logItems.push(logElement);

    rootElement.append(logElement);
  };

  let hidden = false;

  hideShowElement.onclick = () => {
    hidden = !hidden;
    rootElement.className = hidden ? 'hide' : '';
    console.log({ hidden, class: rootElement.className });
  };

  jsInputElement.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      console.log('>>> ' + jsInputElement.value);
      try {
        console.log((0, eval)(jsInputElement.value));
      } catch (e) {
        console.error(e);
      }
      jsInputElement.value = '';
    }
  });

  headElement.append(styleElement);
  bodyElement.append(rootElement);
  bodyElement.append(jsInputElement);
  bodyElement.append(hideShowElement);
})();
