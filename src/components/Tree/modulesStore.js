import { writable } from 'svelte/store';

export const _selected = writable([])

_selected.select = item => _selected.update(currentItems => {
  setSelected(item, true)
  return [...currentItems, item]
})

_selected.remove = item => _selected.update(currentItems => {
  setSelected(item, false)
  return currentItems.filter(key => key !== item);
})

function setSelected(key, isSelected) {
  // const variable = variables.get(key)
  // variable.selected = isSelected
}
