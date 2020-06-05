import { Product } from '../Product.js'

/**
 * TO DO
 * - Create the Dag using a Products Translation map
 * - Graph Y variable must be Numeric
 * - Line Graph if X variable isNumeric
 * - Bar Graph if X variable ! isNumeric
 * - this.graph.x.values = []
 * - this.graph.y.values = []
 * - this.graph.z.lines.values = []
 */

const catalogKey = 'surface.primary.fuel.model.catalogKey'
const hpua = 'surface.weighted.fire.heatPerUnitArea'
const beta = 'surface.primary.fuel.bed.packingRatio'
const ros = 'surface.weighted.fire.arithmeticMean.spreadRate'
const configFuelPrimary = 'configure.fuel.primary'
const midflameWind = 'site.wind.speed.atMidflame'
const moisDead1 = 'site.moisture.dead.tl1h'
const zero10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

test('Graph with numeric x axis', () => {
  const product = new Product()
  expect(product.lang).toEqual('en_US')

  // Step 1 - select a product
  const products = product.requestProduct()
  expect(products).toHaveProperty('selector', 'radio')
  expect(products).toHaveProperty('selections', 1)
  expect(products).toHaveProperty('prompt', 'Product')
  expect(products).toHaveProperty('options')
  expect(Object.keys(products.options)).toHaveLength(8)
  expect(products.options).toHaveProperty('graph')

  product.setProduct('graph')
  expect(product.product).toEqual('graph')

  // Step 2 - select a fire module
  const modules = product.requestModule()
  expect(modules).toHaveProperty('selector', 'radio')
  expect(modules).toHaveProperty('selections', 1)
  expect(modules).toHaveProperty('prompt', 'BehavePlus Module')
  expect(Object.keys(modules.options)).toHaveLength(7)
  expect(modules.options).toHaveProperty('surfaceFire')

  product.setModule('surfaceFire')
  expect(product.module).toEqual('surfaceFire')

  // Step 3 - select a module node palette
  const palettes = product.requestPalette()
  expect(palettes).toHaveProperty('selector', 'radio')
  expect(palettes).toHaveProperty('selections', 1)
  expect(palettes).toHaveProperty('prompt', 'Variable Palette')
  expect(Object.keys(palettes.options)).toHaveLength(3)
  expect(palettes.options).toHaveProperty('common')
  expect(palettes.options.common).toHaveProperty('label')
  expect(palettes.options).toHaveProperty('intermediate')
  expect(palettes.options.intermediate).toHaveProperty('label')
  expect(palettes.options).toHaveProperty('advanced')
  expect(palettes.options.intermediate).toHaveProperty('label')

  product.setPalette('advanced')
  expect(product.palette).toEqual('advanced')

  // Step 4 - select a y variable
  const y = product.requestGraphYVariable()
  expect(y).toHaveProperty('selector', 'menu')
  expect(y).toHaveProperty('selections', 1)
  expect(y).toHaveProperty('prompt', 'Graph Y variable')
  // Should contain the common variable ros and its units
  expect(y).toHaveProperty('options')
  // NOTE: Because Node keys contain dot separators,
  // they MUST be accessed via Object bracket notation.
  // The following two tests fail as they return 'undefined':
  // expect(Object.hasOwnProperty(ros)).toEqual(true)
  // expect(y.options).toHaveProperty(ros)
  // BUT, bracket notaqtion works fine:
  let keys = Object.keys(y.options)
  expect(keys).toHaveLength(4)
  expect(keys).toContain(ros)
  expect(y.options[ros]).toHaveProperty(
    'label',
    'Surface Fire Maximum Spread Rate'
  )
  expect(y.options[ros]).toHaveProperty('units')
  expect(y.options[ros].units).toContain('ft/min')
  expect(y.options[ros].units).toContain('ch/h')
  expect(y.options[ros].units).toContain('m/min')
  // Keys should also contain this intermediate palette variable
  expect(keys).toContain(hpua)
  expect(y.options[hpua]).toHaveProperty(
    'label',
    'Surface Fire Heat per Unit Area'
  )
  expect(y.options[hpua]).toHaveProperty('units')
  expect(y.options[hpua].units).toContain('btu/ft2')
  // Keys should contain this advanced palette variable
  expect(keys).toContain(beta)
  expect(y.options[beta]).toHaveProperty('label')
  expect(y.options[beta]).toHaveProperty('units')
  // Should NOT contain any discrete variables
  expect(keys).not.toContain(catalogKey)

  product.setGraphYVariable(ros, 'ft/min')
  expect(product.graph.y.node.node.key).toEqual(ros)
  expect(product.graph.y.units).toEqual('ft/min')
  const selectedNodes = product.dag.selectedNodes()
  expect(selectedNodes.length).toEqual(1)

  // Step 5 - select configuration options
  const configs = product.requestConfigurationOptions()
  // For ros, there are 10 applicable configuration selectors
  keys = Object.keys(configs)
  expect(keys.length).toEqual(10)
  expect(keys).toContain(configFuelPrimary)
  const config = configs[configFuelPrimary]
  expect(config).toHaveProperty('selector', 'menu')
  expect(config).toHaveProperty('selections', 1)
  expect(config).toHaveProperty(
    'prompt',
    'Primary fuels are specified by entering'
  )
  expect(config).toHaveProperty('options')
  expect(config.options).toHaveProperty('catalog')
  expect(config.options.catalog).toHaveProperty('label', 'a fuel catalog key')

  product.setConfigurationOptions([
    ['configure.fuel.primary', 'catalog'],
    ['configure.fuel.secondary', 'none'],
    ['configure.fuel.moisture', 'individual'],
    ['configure.fuel.curedHerbFraction', 'estimated'],
    ['configure.fuel.chaparralTotalLoad', 'input'],
    ['configure.fuel.windSpeedAdjustmentFactor', 'input'],
    ['configure.slope.steepness', 'ratio'],
    ['configure.wind.direction', 'upslope'],
    ['configure.wind.speed', 'atMidflame'],
    ['configure.fire.effectiveWindSpeedLimit', 'applied']
  ])

  // Step 6 - select an x-axis variable from required inputs
  const x = product.requestGraphXVariable()
  expect(x).toHaveProperty('selector', 'menu')
  expect(x).toHaveProperty('selections', 1)
  expect(x).toHaveProperty('prompt', 'Graph X variable')
  // Should contain the common variable ros and its units
  expect(x).toHaveProperty('options')
  // catalogKey, 5 fuel moistures, slope, midflame
  keys = Object.keys(x.options)
  expect(keys.length).toEqual(8)
  expect(keys).toContain(midflameWind)
  expect(x.options[midflameWind]).toHaveProperty('label')
  expect(x.options[midflameWind]).toHaveProperty('units')
  expect(x.options[midflameWind].units).toContain('ft/min')
  expect(x.options[midflameWind].units).toContain('mi/h')

  product.setGraphXVariable(midflameWind, 'ft/min')
  expect(product.graph.x.node.node.key).toEqual(midflameWind)
  expect(product.graph.x.units).toEqual('ft/min')

  // Step 7 -request X axis values
  const xval = product.requestGraphXValues()
  expect(xval).toHaveProperty('selector', 'range') // 'menu' for discrete
  expect(xval).toHaveProperty('selections', 3) // 5 for discrete
  expect(xval).toHaveProperty('units', 'ft/min')
  expect(xval).toHaveProperty('initial')
  expect(xval.initial).toHaveProperty('minVal')
  expect(xval.initial).toHaveProperty('maxVal')
  expect(xval.initial).toHaveProperty('stepVal')
  expect(xval).toHaveProperty('options', null)
  expect(xval).toHaveProperty(
    'prompt',
    'Enter x-axis min and max values, and number of data points'
  )

  product.setGraphXValues([0, 10, 1])
  expect(product.graph.x.data).toEqual(zero10)

  // Step 8 - request graph Z variable
  const z = product.requestGraphZVariable()
  expect(z).toHaveProperty('selector', 'menu')
  expect(z).toHaveProperty('selections', 1)
  expect(z).toHaveProperty('prompt', 'Graph Z variable')
  expect(z).toHaveProperty('options')
  // catalogKey, 5 fuel moistures, slope, midflame
  keys = Object.keys(z.options)
  // console.log(keys)
  expect(keys.length).toEqual(8)
  expect(keys).not.toContain(midflameWind)
  expect(keys).toContain(moisDead1)
  expect(keys).toContain('none')
  expect(keys).toContain(catalogKey)
  expect(z.options[catalogKey]).toHaveProperty('units', null)

  product.setGraphZVariable(catalogKey)
  expect(product.graph.z.node.node.key).toEqual(catalogKey)
  expect(product.graph.z.units).toEqual(null)

  // Step 9 - request graph Z values

  // Step 10 - Request remaining input values
  //   const singleInputs = product.requestRemainingInputs()
  //   expect(singleInputs.length).toEqual(5)
  //   // inputs = [[nodeRef, value, units]]
  //   const inputs = [
  //     [dag.get('site.moisture.dead.tl1h'), [0.05]],
  //     [dag.get('site.moisture.dead.tl10h'), [0.07]],
  //     [dag.get('site.moisture.dead.tl100h'), [0.09]],
  //     [dag.get('site.moisture.live.herb'), [0.5]],
  //     [dag.get('site.moisture.live.stem'), [1.5]]
  //   ]
  //   product.setRemainingInputs(inputs)

  //   // Step 12
  //   product.requestDecorations()
  //   product.setDecorations('Title', 'sub title', 'user name', 'agency', true)

  //   // Step 13
  //   product.generateGraphData()
})
