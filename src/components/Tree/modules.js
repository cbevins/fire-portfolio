// This extends the Dag.node.map via shared keys
// with additional user interface properties
// such as 'selected', 'module', 'palette', 'units', etc props

export const variables = new Map([
  ['a1', {selected: false, label: 'Maximum Fire Spread Rate' }],
  ['a2', {selected: false, label: 'Direction of Maximum Spread from Upslope'}],
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

function map(key) {
  const obj = variables.get(key)
  return {type: 'item', key: key, label: obj.label, items: []}
}

function x(key) {
  const obj = variables.get(key)
  return {type: 'item', key: key, selected: obj.selected, label: obj.label}
}
export const modules = [
  { type: 'container',
    key:  'surfaceFire',
    label: 'Surface Fire',
    items: [x('a1'), x('a2'), x('a3')],
  }, {
    type: 'container',
    key: 'fireEllipse',
    label: 'Fire Ellipse',
    items: [x('b1'), x('b2'), x('b3'), x('b4'), x('b5'), x('b6')]
  }, {
    type: 'container',
    key: 'scorchHeight',
    label: 'Scorch Height',
    items: [x('c1')]
  }, {
    type: 'container',
    key: 'treeMortality',
    label: 'Tree Mortality',
    items: [x('d1'), x('d2'), x('d3')],
  }
]
