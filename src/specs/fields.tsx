import React from 'react'
import {
  LinearProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { DataType, Datum, Status } from './types'

const useColoredStyles = makeStyles(({ palette }) => ({
  not_started: {
    color: palette.text.disabled
  },
  started: {
    color: palette.text.primary
  },
  done: {
    color: palette.success.main
  },
  canceled: {
    color: palette.error.main
  }
}))

const ColoredComponent: React.FC<{ status: string }> = ({ status }) => {
  const classes = useColoredStyles()
  return <span className={classes[status as Status]}>{status.toUpperCase()}</span>
} 

const MainDataType: DataType<Datum> = {
  key: 'main',
  display: 'Main Type',
  fields: [
    'id',
    'name',
    'email',
    {
      key: 'progress',
      views: [
        {
          name: 'Number',
          render: row => <>{row.progress}%</>,
        },
        {
          name: 'Progress',
          default: true,
          render: row => (
            <LinearProgress variant="determinate" value={row.progress} />
          ),
        }
      ]
    },
    {
      key: 'status',
      views: [
        {
          name: 'Uncolored',
          render: row => <>{row.status.toUpperCase()}</>,
        },
        {
          name: 'Colored',
          default: true,
          render: row => <ColoredComponent status={row.status} />,
        }
      ]
    }
  ],
}

export default MainDataType.fields
