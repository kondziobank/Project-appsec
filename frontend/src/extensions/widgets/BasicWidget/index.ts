import { makeWidget } from '../../../sdk'
import Configurator from "./Configurator";
import Viewer from "./Viewer";
import translations from './translations.json'

export default makeWidget({
    translations,
    metadata: props => ({
        name: props.t('name'),
        category: ['example'],
        initialConfig: {
            text: 'Arnold'
        },
    }),
    viewer: Viewer,
    configurator: Configurator
})
