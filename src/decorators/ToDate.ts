import { Transform } from 'class-transformer'
import { isDate, isDateString } from 'class-validator'

export const ToDate = () =>
  Transform(({ value }) => {
    console.log(value)
    console.log(isDateString(value))
    console.log(new Date(value))
    console.log(isDate(new Date(value)))
    return isDateString(value) ? new Date(value) : value
  })
