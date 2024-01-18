import { makeWidget } from '../../../sdk'
import Configurator from "./Configurator";
import Viewer from "./Viewer";
import translations from './translations.json'
import defaultText from '!!raw-loader!./example.md'

export default makeWidget({
    translations,
    metadata: props => ({
        name: props.t('name'),
        category: ['basic'],
        initialConfig: {
            text: defaultText,
        },
    }),
    viewer: Viewer,
    configurator: Configurator,
})
