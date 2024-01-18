import { makeWidget } from '../../../sdk'
import Configurator from "./Configurator";
import Viewer from "./Viewer";
import translations from './translations.json'

export default makeWidget({
    translations,
    metadata: props => ({
        name: props.t('name'),
        category: ['basic'],
        initialConfig: {
            fileIds: [],
        },
    }),
    viewer: Viewer,
    configurator: Configurator
})
