import { BpxDag } from '../../behaveplus/BpxDag.js'

test('Node.isNumeric()', () => {
  const dag = BpxDag('products')

  const aQuantity = dag.get('surface.weighted.fire.arithmeticMean.spreadRate')
  expect(aQuantity.isNumeric()).toEqual(true)

  const aFloat = dag.get('site.map.scale')
  expect(aFloat.isNumeric()).toEqual(true)

  const aFraction = dag.get('site.canopy.fuel.shading')
  expect(aFraction.isNumeric()).toEqual(true)

  const aCount = dag.get('spotting.torchingTrees.count')
  expect(aCount.isNumeric()).toEqual(true)

  const anIndex = dag.get(
    'surface.primary.fuel.bed.dead.particle.class1.sizeClass'
  )
  expect(anIndex.isNumeric()).toEqual(true)

  const anOption = dag.get('crown.fire.initiation.type')
  expect(anOption.isNumeric()).toEqual(false)

  const aBool = dag.get('crown.fire.initiation.isActiveCrownFire')
  expect(aBool.isNumeric()).toEqual(false)

  const catalogKey = dag.get('surface.primary.fuel.model.catalogKey')
  expect(catalogKey.isNumeric()).toEqual(false)

  const aConfig = dag.get('configure.fuel.primary')
  expect(aConfig.isNumeric()).toEqual(false)

  const aText = dag.get('docs.run.mainTitle')
  expect(aText.isNumeric()).toEqual(false)
})
