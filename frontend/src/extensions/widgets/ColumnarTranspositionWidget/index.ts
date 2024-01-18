import { makeWidget } from '../../../sdk'
import Viewer from "./Viewer";
import translations from './translations.json'

export default makeWidget({
    translations,
    metadata: props => ({
        name: props.t('name'),
        category: ['crypto'],
        initialConfig: {
            text: 'wikipedia jest najlepsza',
            key: '210'
        },
    }),
    viewer: Viewer,
})
