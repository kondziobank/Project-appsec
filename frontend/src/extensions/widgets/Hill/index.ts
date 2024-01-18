import { makeWidget } from '../../../sdk'
import Viewer from "./Viewer";
import translations from './translations.json'

export default makeWidget({
    translations,
    metadata: props => ({
        name: props.t('name'),
        category: ['crypto'],
        initialConfig: {
            text: 'TAJNAWIADOMOSC',
            key:  'HILL',
            encrypt: true
        },
    }),
    viewer: Viewer,
})
