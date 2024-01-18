import { makeWidget } from '../../../sdk'
import viewer from './Viewer'
import configurator from './Configurator'
import translations from './translations.json'

export default makeWidget({
    translations,
    metadata: props => ({
        name: props.t('name'),
        category: ['basic'],
        initialConfig: {
            question: props.t('exampleQuestion'),
            answers: props.t('exampleAnswers').map((answer: string, index: number) => ({
                answer,
                correct: index === 2
            })),
            randomAnswersOrder: false,
            multipleChoice: true
        }
    }),
    viewer,
    configurator,
})
