// This extends the Dag.node.map via shared keys
// with additional user interface properties
// such as 'selected', 'module', 'palette', 'units', etc props

export const variableMap = new Map([
  ['a1', {selected: false, label: 'Maximum Fire Spread Rate' }],
  ['a2', {selected: true, label: 'Direction of Maximum Spread from Upslope'}],
  ['a3', {selected: false, label: 'Maximum Flame Length'}],
  ['b1', {selected: false, label: 'Spread Rate at Ellipse Head'}],
  ['b2', {selected: false, label: 'Flame Length at Ellipse Head'}],
  ['b3', {selected: false, label: 'Spread Rate at Ellipse Flank'}],
  ['b4', {selected: false, label: 'Flame Length at Ellipse Flank'}],
  ['b5', {selected: false, label: 'Spread Rate at Ellipse Back'}],
  ['b6', {selected: false, label: 'Flame Length at Ellipse Back'}],
  ['c1', {selected: false, label: 'Scorch Height'}],
  ['d1', {selected: false, label: 'Tree Mortality'}],
  ['d2', {selected: false, label: 'Bark Thckness'}],
  ['d3', {selected: false, label: 'Scorch Height'}],
])

function v(key) {
  const obj = variableMap.get(key)
  return {
    type: 'item',
    key: key,
    label: obj.label,
    items: [],
    selected: obj.selected
  }
}

export const variableTree = [
  { type: 'container',
    key:  'surfaceFire',
    label: 'Surface Fire',
    items: [v('a1'), v('a2'), v('a3')],
  }, {
    type: 'container',
    key: 'fireEllipse',
    label: 'Fire Ellipse',
    items: [v('b1'), v('b2'), v('b3'), v('b4'), v('b5'), v('b6')]
  }, {
    type: 'container',
    key: 'scorchHeight',
    label: 'Scorch Height',
    items: [v('c1')]
  }, {
    type: 'container',
    key: 'treeMortality',
    label: 'Tree Mortality',
    items: [v('d1'), v('d2'), v('d3')],
  }
]
