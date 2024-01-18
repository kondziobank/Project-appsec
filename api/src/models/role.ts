import mongoose from 'mongoose'
import config from '@/config'
import NamedSchema from '@/services/database/plugins/named-schema'
import SluggableSchema from '@/services/database/plugins/sluggable-schema'

const RoleSchema = new mongoose.Schema({
    permissions: [
        {
            type: String,
            trim: true,
            required: true,
            enum: {
                values: config.permissions,
                message: '{VALUE} is not a valid permission',
            }
        },
    ],
    builtIn: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

RoleSchema.plugin(NamedSchema)
RoleSchema.plugin(SluggableSchema, { sluggableField: 'name' })

export default mongoose.model('Role', RoleSchema)
