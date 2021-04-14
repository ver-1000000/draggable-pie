import { version } from 'package.json';

import { DraggablePie } from 'src';

function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val == null) { throw new Error(`Expected value to be defined, but received ${val}`); }
}

const createElementByHtml = <T extends Element>(html: string): T => {
  const div = document.createElement('div');
  div.innerHTML = html;
  const innerHTML = div.firstElementChild as T | null;
  assertIsDefined(innerHTML);
  return innerHTML;
};

const updatePie = (draggablePie: DraggablePie) => {
  const ol       = document.getElementById('datasets-ol');
  const datasets = [...ol?.querySelectorAll('li') || []].map(li => {
    const valueInput: HTMLInputElement = li.querySelector('[type=number]')!;
    const colorInput: HTMLInputElement = li.querySelector('[type=color]')!;
    return { value: valueInput.valueAsNumber || 0, color: colorInput.value };
  });
  draggablePie.updateDraggablePieOptions({ datasets });
};

const addDatasetList = (draggablePie: DraggablePie, options = { color: '#de4e3e', value: 50 }) => {
  const query   = `
    <li>
      <input type="number" value="${options.value}">
      <input type="color" value="${options.color}">
      <button type="button">remove</button>
    </li>`;
  const ol       = document.getElementById('datasets-ol');
  const li       = createElementByHtml<HTMLLIElement>(query);
  const input    = li.querySelector('input')!;
  const button   = li.querySelector('button')!;
  input.oninput  = () => { updatePie(draggablePie); };
  button.onclick = () => {
    ol?.removeChild(li);
    updatePie(draggablePie);
  };
  ol?.appendChild(li);
  updatePie(draggablePie);
};

window.onload = () => {
  Object.assign(document.getElementById('version') || {}, { textContent: version })
  const draggablePie = new DraggablePie({ class: 'pie' });
  const projector    = document.getElementById('projector')!;
  const addButton    = document.getElementById('add-button')!;
  projector.appendChild(draggablePie.element);
  addButton.onclick = () => addDatasetList(draggablePie);
  addDatasetList(draggablePie, { color: '#e00496', value: 50 });
  addDatasetList(draggablePie, { color: '#94e006', value: 50 });
  addDatasetList(draggablePie, { color: '#9406e0', value: 50 });
};
