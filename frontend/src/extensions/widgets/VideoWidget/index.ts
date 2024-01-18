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
            videoUrl: 'https://www.youtube.com/embed/L4Iog0czBVU',
        },
    }),
    viewer: Viewer,
    configurator: Configurator
})
