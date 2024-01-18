import { makeWidget } from '../../../sdk'
import Viewer from "./Viewer";
import translations from './translations.json'
import exampleText from '!!raw-loader!./example.txt'

export default makeWidget({
    translations,
    metadata: props => ({
        name: props.t('name'),
        category: ['crypto'],
        initialConfig: {
            text: exampleText
        },
    }),
    viewer: Viewer
})
