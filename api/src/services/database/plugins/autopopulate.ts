import mongoose from "mongoose"


export default function Autopopulate(schema: mongoose.Schema) {
    schema.pre(/find(One)?/, function (next) {
        for (const field in this.schema.obj) {
            this.populate(field)
        }
        next()
    })
}
