import { FieldView } from '../specs/types'

export type View<T> = {
  current: FieldView<T> | null,
  allowed: string[]
}

export type ViewMap<T> = {
  [key: string]: View<T>
}