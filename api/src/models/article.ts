import mongoose from 'mongoose'
import NamedSchema from '@/services/database/plugins/named-schema'
import SluggableSchema from '@/services/database/plugins/sluggable-schema'

const ArticleSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        default: '{}'
    },
    public: {
        type: Boolean,
        required: true,
        default: false
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
}, {
    timestamps: true
})

ArticleSchema.plugin(NamedSchema)
ArticleSchema.plugin(SluggableSchema, { sluggableField: 'name' })

export default mongoose.model('Article', ArticleSchema)
