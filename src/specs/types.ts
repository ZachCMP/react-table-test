export enum Status {
  NotStarted = 'not_started',
  Started = 'started',
  Canceled = 'canceled',
  Done = 'done',
}

export interface Datum {
  id: string
  name: string
  email?: string
  progress: number
  status: Status
}

export interface FieldView<T> {
  name: string
  default?: boolean
  render: RenderFn<T>
}

type RenderFn<T> = (row: T) => void

export interface Field<T> {
  key: string
  display?: string
  fragment?: string
  views?: FieldView<T>[]
}

export interface DataType<T> {
  key: string
  display?: string
  fields: Array<string | Field<T>>
  fieldOrder?: string[]
}