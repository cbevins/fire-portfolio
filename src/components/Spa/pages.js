export const getExamplePages = function (nPages = 10) {
  const pages = []
  for (let i = 0; i < nPages; i++) {
    pages.push({ id: `page-${i}`, title: `Welcome to Page ${i}` })
  }
  return addPrevNext(pages)
}

const addPrevNext = function (pages) {
  const nPages = pages.length
  for (let i = 0; i < nPages - 1; i++) {
    pages[i].next = pages[Math.min(nPages - 1, i + 1)].id
    pages[i].prev = pages[Math.max(0, i - 1)].id
  }
  return pages
}

export const getGraphPages = function () {
  const pages = [
    { id: 'graphYVariablePage', title: 'Select Graph Y Variable' },
    { id: 'graphConfigureModulesPage', title: 'Configure Fire Modules' },
    { id: 'graphXVariablePage', title: 'Select Graph X Variable' },
    { id: 'graphZVariablePage', title: 'Select Graph Z Variable' },
    { id: 'graphInputsPage', title: 'Enter Fire Model Inputs' },
    { id: 'graphDecorationsPage', title: 'Enter Graph Decorations' },
    { id: 'graphViewPage', title: 'View Graph' }
  ]
  return addPrevNext(pages)
}
