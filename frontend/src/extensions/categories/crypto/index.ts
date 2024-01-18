import { makeCategory } from '../../../sdk'
import translations from './translations.json'

export default makeCategory({
    translations,
    metadata: props => ({
        name: props.t('name')
    })
})
