export const getExamplePages = function (nPages = 10) {
  const pages = []
  for (let i = 0; i < nPages; i++) {
    pages.push({ id: `page-${i}`, title: `Welcome to Page ${i}` })
  }
  return pages
}

export const getGraphPages = function () {
  const pages = [
    {
      id: 'graphIntroPage',
      title: 'Begin Graph',
      components: ['GreenThing', 'RedThing', 'BlueThing']
    }, {
      id: 'graphYVariablePage',
      title: 'Select Graph Y Variable',
      components: ['VariableSelector']
    }, {
      id: 'graphConfigureModulesPage',
      title: 'Configure Fire Modules',
      components: ['GreenThing']
    }, {
      id: 'graphXVariablePage',
      title: 'Select Graph X Variable',
      components: ['BlueThing']
    }, {
      id: 'graphZVariablePage',
      title: 'Select Graph Z Variable',
      components: ['RedThing']
    }, {
      id: 'graphInputsPage',
      title: 'Enter Fire Model Inputs',
      components: ['GreenThing']
    }, {
      id: 'graphDecorationsPage',
      title: 'Enter Graph Decorations',
      components: ['BlueThing']
    }, {
      id: 'graphViewPage',
      title: 'View Graph',
      components: ['RedThing']
    }
  ]
  return pages
}
