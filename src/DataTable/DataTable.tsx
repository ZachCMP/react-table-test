import React, { useState, useMemo, PropsWithChildren } from 'react'
import arrayMove from 'array-move'
import {
  TableContainer,
  Table,
} from '@material-ui/core'

import { Field, FieldView } from '../specs/types'
import { ViewMap } from './types'

import DataTableBody from './Body'
import DataTableHead from './Head'

const useOrderedFields = (fields: Array<string | Field<any>>) => {
  const [fieldOrder, setFieldOrder] = useState<string[]>(fields.map(field => typeof field === 'string' ? field : field.key))

  const orderedFields = useMemo(
    () => (
      fieldOrder
      .map(key => (
        fields.find(f => typeof f === 'string' ? f === key : f.key === key)
      )) as Array<string | Field<any>>
    ),
    [fields, fieldOrder]
  )

  return [orderedFields, fieldOrder, setFieldOrder] as const
}

const useViews = <T, >(fields: Array<string | Field<T>>) => {
  const [selectedViews, setSelectedViews] = useState<{ [key: string]: string }>({})

  console.log({ selectedViews })

  const views: ViewMap<T> = fields.reduce((acc, field) => {
    const key = typeof field === 'string' ? field : field.key
    let current: FieldView<T> | null = null
    let allowed: string[] = []
    if (typeof field !== 'string' && field.views && field.views.length > 0) {
      current = field.views.find(v => v.name === selectedViews[key] || v.default) || field.views[0]
      allowed = field.views.map(v => v.name)
    }
    return { 
      ...acc,
      [key]: {
        current,
        allowed,
      } 
    }
  }, {})

  const setView = (key: string, viewName: string) => {
    setSelectedViews({ ...selectedViews, [key]: viewName })
  }

  return [views, setView] as const
}

interface DataTableProps<T> {
  data: T[]
  fields: Array<string | Field<T>>
  sortField: keyof T
  sortDir: 'asc' | 'desc'
  setSortField: (field: keyof T) => void
}

const DataTable = <T, >(
  { fields, data, sortField, sortDir, setSortField }: PropsWithChildren<DataTableProps<T>>
) => {
  const [orderedFields, fieldOrder, setFieldOrder] = useOrderedFields(fields)
  const [views, setView] = useViews(orderedFields)

  return (
    <TableContainer>
      <Table size="small">
        <DataTableHead<T>
          fields={orderedFields}
          moveField={(i, to) => setFieldOrder(arrayMove(fieldOrder, i, to))}
          sortField={sortField}
          sortDir={sortDir}
          setSortField={setSortField}
          views={views}
          setView={setView}
        />
        <DataTableBody
          data={data} 
          fields={orderedFields}
          views={views}
        />
      </Table>
    </TableContainer>
  )
}

export default DataTable