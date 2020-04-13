import faker from 'faker'

import { Datum as DatumType, Status } from './types'

export default class Datum implements DatumType {
  readonly id: string
  private _name: string
  private _email?: string
  private _progress: number
  private _status: Status

  constructor() {
    this.id = faker.random.uuid()
    this._name = faker.name.jobArea()
    this._progress = 0
    this._status = Status.NotStarted
    this._email = faker.random.number(100) > 30 ? faker.internet.email() : undefined

    switch (faker.random.number(4)) {
      case 0:
        this._status = Status.NotStarted
        break
      case 1:
        this._status = Status.Started
        break
      case 2:
        this._status = Status.Started
        this._progress = faker.random.number(90) + 10
        break
      case 3:
        this._status = Status.Canceled
        break
      case 4:
        this._status = Status.Done
    }
  }

  get name(): string {
    return this._name
  }
  set name(newName: string) {
    this._name = newName
  }

  get email(): string | undefined {
    return this._email
  }
  set email(newEmail) {
    this._email = newEmail
  }

  get progress() {
    return this._progress
  }
  set progress(newProgress: number) {
    if (newProgress < 0 || newProgress > 100) throw new Error(`Progress value ${newProgress} out of range 0-100`)
    if (this._status !== Status.Started) throw new Error(`Item status must be "${Status.Started}" to set progress`)
  }

  get status() {
    return this._status
  }
  set status(newStatus: Status) {
    this._status = newStatus
    if (newStatus === Status.Done) this._progress = 100
  }

  json(): DatumType {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      progress: this.progress,
      status: this.status,
    }
  }
}