import { useMemo } from 'react'

import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import mermaid from '@bytemd/plugin-mermaid'
import gemoji from '@bytemd/plugin-gemoji'
import 'bytemd/dist/index.css'
import 'katex/dist/katex.min.css'

import editorPl from './locales/pl/editor.json'
import gfmPl from './locales/pl/gfm.json'
import mermaidPl from './locales/pl/mermaid.json'
import mathPl from './locales/pl/math.json'

export default (props: any) => {
    const locale: any = {}
    if (props.lang === 'pl') {
      locale.editor = editorPl
      locale.mermaid = mermaidPl
      locale.gfm = gfmPl
      locale.math = mathPl
    }
  
    const plugins = useMemo(() => [
      gfm({ locale: locale.gfm }),
      highlight(),
      math({ locale: locale.math }),
      mermaid({ locale: locale.mermaid }),
      gemoji()
    ], [props.theme, locale])

    return props.component(locale, plugins)
}
