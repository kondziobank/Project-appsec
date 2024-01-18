import mongoose from 'mongoose'
import slugify from 'slugify'

export interface SluggableSchemaOptions {
    sluggableField: string
    slugDelimiter?: string
}

function getDefaultOptions() {
    return {
        slugDelimiter: '.'
    }
}

export default function SluggableSchema(schema: mongoose.Schema, options: SluggableSchemaOptions) {
    const defaultOptions = getDefaultOptions()
    const params = { ...defaultOptions, ...options }
    
    schema.add({
        slug: {
            type: String,
            trim: true,
            lowercase: true,
            unique: false, // this field is unique, but its' uniqueness is ensured by the plugin
        },
        _slugPrefix: {
            type: String,
            trim: true,
            lowecase: true,
            select: false,
        },
        _slugDuplicateNumber: {
            type: Number,
            select: false,
        }
    })

    schema.pre('save', async function (this: any, next: any) {
        if (!this.slug || this.modifiedPaths().includes('slug')) {
            this._slugPrefix = this.slug
                ? this.slug.split(params.slugDelimiter)[0]
                : slugify(this[params.sluggableField], {
                    remove: /[*+~.()'"!:@]/g,
                    lower: true
                })

            const maxSlugDuplicateNumberElement = await this.constructor
                .findOne({ _slugPrefix: this._slugPrefix })
                .select('_slugDuplicateNumber')
                .sort('-_slugDuplicateNumber')

            let maxSlugDuplicate = 0;
            if (maxSlugDuplicateNumberElement && maxSlugDuplicateNumberElement.id !== this.id) {
                maxSlugDuplicate = maxSlugDuplicateNumberElement._slugDuplicateNumber
            }

            this._slugDuplicateNumber = maxSlugDuplicate + 1
            this.slug = this._slugDuplicateNumber === 1
                ? this._slugPrefix
                : this._slugPrefix + params.slugDelimiter + this._slugDuplicateNumber
        }
        next()
    })
}
