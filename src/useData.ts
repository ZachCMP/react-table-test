import { useState } from 'react'

import { Datum } from './specs/types'

import makeData from './specs/data'

const sortFns = {
  asc: <T>(field: keyof T) => (a: T, b: T) => a[field] > b[field] ? 1 : -1,
  desc: <T>(field: keyof T) => (a: T, b: T) => a[field] > b[field] ? -1 : 1
}

const useData = () => {
  const [data] = useState(makeData(25))
  const [sortField, setSortField] = useState<keyof Datum>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sortFn = sortFns[sortDir]<Datum>(sortField)

  const changeSortDir = (dir?: 'asc' | 'desc') => {
    if (!dir) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortDir(dir)
    }
  }

  const changeSortField = (field: keyof Datum) => {
    if (field === sortField) {
      changeSortDir()
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  return [
    data.sort(sortFn).map(e => e.json()),
    sortField,
    sortDir,
    {
      changeSortDir,
      changeSortField,
    }
  ] as const
}

export default useData