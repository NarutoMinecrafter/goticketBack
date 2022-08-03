import { Transform } from 'class-transformer'

export const ToBolean = () => Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
