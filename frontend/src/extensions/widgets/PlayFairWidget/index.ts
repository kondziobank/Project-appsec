import { makeWidget } from '../../../sdk'
import Viewer from "./Viewer";
import translations from './translations.json'

export default makeWidget({
    translations,
    metadata: props => ({
        name: props.t('name'),
        category: ['crypto'],
        initialConfig: {
            key: 'szyfr',
            text: 'wikipediajestnajlepsza'
        },
    }),
    viewer: Viewer
})
