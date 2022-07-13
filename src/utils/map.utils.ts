export type Comparator<K, V> = (firstValue: V, secondValue: V, firstKey: K, secondKey: K) => number

export function sortMap<K, V>(map: Map<K, V>, compareFunction: Comparator<K, V>) {
  const newMap = new Map<K, V>();

  const entries = [...map.entries()]
  entries.sort((a, b): number => compareFunction(a[1], b[1], a[0], b[0]))

  for (const [k, v] of entries) {
    newMap.set(k, v)
  }

  return newMap
}