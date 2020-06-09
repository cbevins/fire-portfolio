import { writable } from 'svelte/store';
import { variableMap } from './modules.js'

export const _selected = writable([])

_selected.select = (item, isSelected) => _selected.update(currentItems => {
  variableMap.get(item).selected = isSelected
  return isSelected ? [...currentItems, item]
    : currentItems.filter(key => key !== item)
})
