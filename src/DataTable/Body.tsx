import React from 'react'
import {
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@material-ui/core'

import { Field, FieldView } from '../specs/types'
import { ViewMap } from './types'

interface DataTableBodyProps {
  data: { [key: string]: any }[]
  fields: Array<string | Field<any>>
  views: ViewMap<any>
}

const DefaultComponent: React.FC = ({ children }) => <>{children}</>

const CellComponent: React.FC<{ field: string | Field<any>, row: { [key: string]: any }, view: FieldView<any> | null }> = ({ field, row, view }) => {
  if (view) {
    return <>{view.render(row)}</>
  } else if (typeof field === 'string') {
    return <DefaultComponent>{row[field]}</DefaultComponent>
  } else {
    return (
      <DefaultComponent>
        <Typography color="textSecondary">No view</Typography>
      </DefaultComponent>
    )
  }
}

const DataTableBody: React.FC<DataTableBodyProps> = ({ fields, data, views }) => {
  return (
    <TableBody>
      {data.map((row, i) => (
        <TableRow key={row.id || i}>
          {fields.map(field => {
            const key = typeof field === 'string' ? field : field.key
            return (
              <TableCell key={typeof field === 'string' ? field : field.key}>
                <CellComponent field={field} row={row} view={views[key].current} />
              </TableCell>
            )
          })}
        </TableRow>
      ))}
    </TableBody>
  )
}

export default DataTableBody