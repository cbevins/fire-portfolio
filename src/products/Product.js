import { BehavePlus, Dag, Equations } from 'behaveplus-core'
import * as Available from './Available.js'
import * as Dictionary from './Dictionary.js'

const GraphLine = { color: '#000000', width: 1, style: 'solid' }
const GraphVar = {
  node: null,
  units: null,
  decimals: 2,
  data: [],
  line: { ...GraphLine }
}

export class Product {
  constructor (language = 'en_US') {
    this.root = new Dag.Root(
      BehavePlus.BpxGenome,
      BehavePlus.BpxVariantMap,
      Equations.MethodMap,
      Dictionary.TranslationMap
    )
    this.dag = this.root.addDag('Products')
    this.lang = language
    this.product = 'graph' // 'graph', 'oneWayTable', etc
    this.module = 'surfaceFire' // 'surfaceFire', 'fireEllipse', etc
    this.palette = 'common' // 'common', 'intermediate', 'advanced'
    this.decoration = {}
    this.inputs = {}
    this.graph = {
      x: { ...GraphVar },
      y: { ...GraphVar },
      z: { ...GraphVar, atValues: [] }
    }
  }

  // Returns an object of Available selector options
  // from the Available.<itemsList> and Dictionary text
  // @return An object of [key]: {label: 'string'} properties
  _availableItems (availableItems, key) {
    const options = {}
    availableItems.forEach(option => {
      options[option] = { label: this._optionLabel(key, option) }
    })
    return options
  }

  /**
   * Helper function that returns the TranslationMap text for a key + '/label'
   * @param {string} key The TranslationMap key prefix that ends at '/label'
   */
  _keyLabel (key) {
    return this.dag.tr(`${key}/label`, this.lang, `${key}*`)
  }

  _optionLabel (key, option) {
    return this.dag.tr(`${key}/option=${option}/label`, this.lang, `${key}*`)
  }

  /**
   * Step 1 - product selection
   * @return A data object for building a product selector
   */
  requestProduct () {
    return {
      selector: 'radio',
      selections: 1,
      prompt: this._keyLabel('product'),
      options: this._availableItems(Available.ProductsList, 'product') // [[key, label]]
    }
  }

  /**
   * Callback for a product selector
   * @param {string} product The selected product key ['graph', 'oneWay', ...]
   */
  setProduct (product) {
    this.product = product
  }

  /**
   * Step 2 - fire module selection
   * @return A data object for building a fire module selector
   *
   * Restricts the choice of possible 'selected' Nodes to a specific module
   */
  requestModule () {
    return {
      selector: 'radio',
      selections: 1,
      prompt: this._keyLabel('module'),
      options: this._availableItems(Available.ModulesList, 'module') // [[key, label]]
    }
  }

  /**
   * Callback for a module selector
   * @param {string} module The selected fire module key
   */
  setModule (module) {
    this.module = module
  }

  /**
   * Step 3 - module palette selection
   * @return A data object for building a module palette selector
   *
   * Further restricts the choice of possible 'selected' Nodes
   * to a specific subset of the current fire module.
   */
  requestPalette () {
    return {
      selector: 'radio',
      selections: 1,
      prompt: this._keyLabel('palette'),
      options: this._availableItems(Available.PalettesList, 'palette') // [[key, label]]
    }
  }

  /**
   * Callback for a palette selector
   * @param {string} palette  The selected palette key
   */
  setPalette (palette) {
    this.palette = palette
  }

  /**
   * Helper function for requestGraphYVariable
   * Builds options[] and units[] arrays
   * @param {object} palette Reference to the Available.VariablesList.<module>.<palette>
   * @param {object} options Reference to the options object to be mutated
   * @returns An object of [nodeKey]: {label: 'string', units: [array]} properties
   * Only numeric variables will be pushed onto the mutated options object
   */
  _yVariables (palette, options) {
    palette.forEach(nodeKey => {
      const node = this.dag.get(nodeKey)
      if (node.isNumeric()) {
        options[nodeKey] = {
          label: this._keyLabel(nodeKey),
          units: node.isQuantity() ? node.variant.ref.uomKeys() : null
        }
      }
    })
  }

  /**
   * Step 4 - graph Y variable selection
   * @return A data object for a building a Y variable key & units selector
   * Only numeric variables for the selected module and palette are available
   */
  requestGraphYVariable () {
    const options = {}
    const module = Available.VariablesList[this.module]
    this._yVariables(module.common, options)
    if (this.palette === 'intermediate' || this.palette === 'advanced') {
      this._yVariables(module.intermediate, options)
    }
    if (this.palette === 'advanced') {
      this._yVariables(module.advanced, options)
    }
    return {
      selector: 'menu',
      selections: 1,
      prompt: this._keyLabel('selector.graph.y.variable'),
      options
    }
  }

  /**
   * Callback for a graph Y variable selector
   * @param {string} nodeKey Key of the selected Y variable Node
   * @param {string} units  Display units of the selected Y variable
   */
  setGraphYVariable (nodeKey, units) {
    this.graph.y.node = this.dag.get(nodeKey)
    this.graph.y.units = units
    this.graph.y.data = []
    this.dag.clearSelected()
    this.dag.runSelected([[this.graph.y.node, true]])
  }

  /**
   * Step 5 - configuration option selection
   * @return An array of data objects for building a set of configuration selectors
   *
   * Only configuration options applicable for the selected variables are included
   */
  requestConfigurationOptions () {
    const configs = {}
    this.dag.requiredConfigNodes().forEach(config => {
      const configKey = config.node.key
      const options = {}
      config.variant.ref.options().forEach(opt => {
        options[opt] = { label: this._optionLabel(configKey, opt) }
      })
      configs[configKey] = {
        selector: 'menu',
        selections: 1,
        prompt: this._keyLabel(configKey),
        options
      }
    })
    return configs
  }

  /**
   * Callback function for a configuration selector
   * @param {array} configs Array = [
   *  ['configKey1', 'configValue1'],
   *  ['configKeyN', 'configValueN'],
   * ]
   */
  setConfigurationOptions (configs) {
    this.dag.runConfigs(configs)
  }

  /**
   * Step 6 - graph x variable selection
   * @return A data object for building an x variable key & units selector
   * Only the required inputs for the current selected Nodes are included.
   * If a numeric X variable is selected, a line chart is produced,
   * otherwise a bar chart is created.
   */
  requestGraphXVariable () {
    // \TO DO - allow ANY required Nodes in the module/palette to be x variables?
    const options = {}
    this.dag.requiredInputNodes().forEach(node => {
      const key = node.node.key
      const variant = node.variant.ref
      options[key] = {
        label: this._keyLabel(key),
        units: node.isQuantity() ? variant.uomKeys() : null
      }
    })
    return {
      selector: 'menu',
      selections: 1,
      prompt: this._keyLabel('selector.graph.x.variable'),
      options
    }
  }

  /**
   * Callback for a graph x variable selector
   * @param {string} nodeKey The selected Node key
   * @param {string} units The preferred units-of-measure key
   */
  setGraphXVariable (nodeKey, units = null) {
    this.graph.x.node = this.dag.get(nodeKey)
    this.graph.x.units = units
    this.graph.x.data = []
  }

  /**
   * Step 7 - Graph X variable range or item selection
   * @return An object for building a selector for either:
   * - a numeric x variable min-max-step, or
   * - a discrete x variable value menu selector
   */
  requestGraphXValues () {
    const node = this.graph.x.node
    const xkey = 'selector.graph.x.variable'
    return node.isNumeric()
      ? {
        selector: 'range',
        selections: 3,
        prompt: this._optionLabel(xkey, 'range'),
        units: this.graph.x.units,
        initial: { minVal: 0, maxVal: 20, stepVal: 1 }, // \TO DO - get from Variant
        options: null
      }
      : {
        selector: 'menu',
        selections: 5,
        prompt: this._optionLabel(xkey, 'menu'),
        units: null,
        initial: node.options()[0],
        options: node.options()
      }
  }

  /**
   * Callback for graph x variable value selector
   * @param {array} values Array of either:
   * - [minVal, maxVal, points] if x variable is numeric
   * - [val1, val2, ...] if x variable is discrete
   */
  setGraphXValues (values) {
    const node = this.graph.x.node
    if (node.isNumeric()) {
      this.graph.x.data = Dag.generateArray(values[0], values[1], values[2])
    } else {
      this.graph.x.data = values
    }
  }

  // Step 8
  requestGraphZVariable () {
    const data = this.requestGraphXVariable()
    data.prompt = this._keyLabel('selector.graph.z.variable')
    delete data.options[this.graph.x.node.node.key]
    data.options.none = { label: 'none', units: null }
    return data
  }

  setGraphZVariable (nodeKey, units = null) {
    this.graph.z.node = nodeKey ? this.dag.get(nodeKey) : null
    this.graph.z.units = units
    this.graph.z.data = []
    this.graph.z.atValues = []
  }

  // Step 9 - request Graph Z variable values

  // Step 10
  requestRemainingInputs () {
    return this.dag
      .requiredInputNodes()
      .filter(node => node !== this.graph.x.node && node !== this.graph.z.node)
  }

  // inputs = [[nodeRef, value, units]]
  setRemainingInputs (inputs) {
    this.inputs = inputs
  }

  // Step 11
  requestDecorations () {}

  setDecorations (title, subtitle, user, agency, timestamp) {
    this.decoration = {
      title: title,
      subtitle: subtitle,
      user: user,
      agency: agency,
      timestamp: timestamp
    }
  }

  // Step 12
  generateGraphData () {
    this.graph.series = []

    // Set all the single-valued inputs
    this.inputs.forEach(([node, value, units]) => {
      // \TODO units conversion on each input value
      this.dag.setInputs([[node, [value]]])
    })

    // Set the x variable range inputs
    const x = this.graph.x
    // \TODO Units conversion on minValue, maxValue, stepValue
    const values = Dag.generateArray(x.minValue, x.maxValue, x.stepValue)
    this.dag.runInputs([[x.node, values]])

    // If their is a Z variable, generate a data series for each Z value
    const z = this.graph.z
    if (z.node) {
      z.lines.forEach(line => {
        // \TODO Unit conversions on each line.value from line.units
        this.dag.runInputs([[z.node, line.value]])
        this.graph.series.push([...this.graph.y.node.value.run])
      })
      return
    }

    // Otherwise, we already have the single line series
    this.graph.series.push([...this.graph.y.node.value.run])
  }
}
