import Datum from './Datum'

export default function makeData(count: number): Datum[] {
  return Array(count).fill(null).map((_, i) => new Datum())
}