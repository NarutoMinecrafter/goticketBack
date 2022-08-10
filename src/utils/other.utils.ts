export function isEmptyObject(object: object) {
  return Object.keys(object).length === 0 && object.constructor === Object
}