import mongoose from "mongoose"

export interface NamedSchemaOptions {
    nameField?: string
}

function getDefaultOptions() {
    return {
        nameField: 'name'
    }
}

export default function NamedSchema(schema: mongoose.Schema, options: NamedSchemaOptions) {
    const defaultOptions = getDefaultOptions();
    const params = { ...defaultOptions, ...options }

    schema.add({
        [params.nameField]: {
            type: String,
            trim: true,
            required: true,
        },
    })
}
