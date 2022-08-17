import { Transform } from 'class-transformer'
import { isDateString } from 'class-validator'

export const ToDate = () => Transform(({ value }) => (isDateString(value) ? new Date(value) : value))
