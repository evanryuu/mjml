// Specs: https://documentation.mjml.io/#mj-style
import type { Editor } from 'grapesjs'
import { componentsToQuery, isComponentType, mjmlConvert } from './utils'
import { type as typeHead } from './Head'

export const type = 'mj-style'

export default (editor: Editor, { opt, coreMjmlModel, coreMjmlView, sandboxEl }: any) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        draggable: componentsToQuery(typeHead),
      },
    },
    view: {
      ...coreMjmlView,
      tagName: 'style',

      getMjmlTemplate() {
        return {
          start: '<mjml><mj-head>',
          end: '</mj-head><mj-body></mj-body></mjml>',
        }
      },

      getTemplateFromEl(sandboxEl: any) {
        return sandboxEl.querySelector('style').innerHTML
      },

      renderStyle() {},

      getTemplateFromMjml() {
        const mjmlTmpl = this.getMjmlTemplate()
        const innerMjml = this.getInnerMjmlTemplate()
        const htmlOutput = mjmlConvert(`${mjmlTmpl.start}
          ${innerMjml.start}${innerMjml.end}${mjmlTmpl.end}`, opt.fonts)
        let html = htmlOutput.html
        const start = html.indexOf('<head>') + 6
        const end = html.indexOf('</head>')
        html = html.substring(start, end).trim()
        sandboxEl.innerHTML = html
        return this.getTemplateFromEl(sandboxEl)
      },
    },
  })
}
