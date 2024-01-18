import mongoose from 'mongoose'
import config from '@/config'

export default async () => mongoose.connect(config.mongodb.url)
