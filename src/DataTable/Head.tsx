import React, { useState, PropsWithChildren } from 'react'
import {
  makeStyles,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import clsx from 'clsx'

import { Field } from '../specs/types'
import { ViewMap, View } from './types'
import { isNullOrUndefined } from 'util'

const useStyles = makeStyles(({ palette, spacing }) => ({
  draggableCell: {
    cursor: 'grab',
    position: 'relative',
    paddingRight: spacing(1),
    borderRight: `1px solid ${palette.divider}`,
    '& div.dropper': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      borderColor: palette.primary.light,
      borderWidth: spacing(0.5),
      '&.right': {
        right: 0,
        left: '70%',
        '&.active': {
          borderRightStyle: 'solid',
        }
      },
      '&.left': {
        left: 0,
        right: '70%',
        '&.active': {
          borderLeftStyle: 'solid',
        }
      }
    },
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: palette.divider
  },
  menuButton: {
    color: palette.text.secondary
  },
  menuText: {
    marginLeft: spacing(2),
    marginRight: spacing(2),
  }
}))

interface DraggableCellProps {
  onDragStart?: VoidFunction
  onDragEnd?: VoidFunction
  onDropAfter?: VoidFunction
  onDropBefore?: VoidFunction
  index: number
  dragged: number | null
  sortDir?: 'asc' | 'desc'
  onClick?: VoidFunction
  view: View<any>
  setView: (viewName: string) => void
}

const DropTarget: React.FC<{ side: 'left' | 'right', onDrop?: VoidFunction }> = ({ side, onDrop }) => {
  const [ active, setActive ] = useState<boolean>(false)

  return (
    <div
      className={clsx(side, 'dropper', { active })} 
      onDrop={onDrop}
      onDragOver={e => !active && setActive(true)}
      onDragLeave={e => active && setActive(false)}
    />
  )
}

const DraggableCell: React.FC<DraggableCellProps> = ({
  children,
  onDragStart,
  onDragEnd,
  onDropAfter, 
  onDropBefore,
  onClick,
  index,
  dragged,
  sortDir,
  view,
  setView,
}) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  return (
    <TableCell
      className={classes.draggableCell}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={e => e.preventDefault()}
      onClick={onClick}
    >
      <Box display="flex" justifyContent="space-between">
        <TableSortLabel
          active={!!sortDir}
          direction={sortDir}
        >
          {children}
        </TableSortLabel>
        {view.allowed && view.allowed.length > 0 ? (
          <Box>
            <IconButton
              size="small"
              className={classes.menuButton}
              onClick={e =>{
                e.stopPropagation()
                e.preventDefault()
                setAnchorEl(e.currentTarget)
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              onClick={e => e.stopPropagation()}
              anchorEl={anchorEl}
              keepMounted
              open={!!anchorEl}
              onClose={e => setAnchorEl(null)}
            >
              <Typography className={classes.menuText} color="textSecondary" display="block" variant="caption">View as:</Typography>
              {view.allowed.map(v => (
                <MenuItem key={v} onClick={() => setView(v)}>{v}</MenuItem>
              ))}
            </Menu>
          </Box>
        ) : null}
      </Box>
      {!isNullOrUndefined(dragged) && dragged !== index && <DropTarget side="left" onDrop={onDropBefore} />}
      {!isNullOrUndefined(dragged) && dragged !== index && <DropTarget side="right" onDrop={onDropAfter} />}
    </TableCell>
  )
}

interface DataTableHeadProps<T> {
  fields: Array<string | Field<T>>
  moveField: (index: number, to: number) => void
  sortField: keyof T
  sortDir: 'asc' | 'desc'
  setSortField: (field: keyof T) => void
  views: ViewMap<T>
  setView: (key: string, viewName: string) => void
}

const DataTableHead = <T, >({ fields, moveField, sortField, sortDir, setSortField, views, setView }: PropsWithChildren<DataTableHeadProps<T>>) => {
  const [dragged, setDragged] = useState<number | null>(null)

  const handleDragStart = (index: number) => setDragged(index)
  const handleDragEnd = () => setDragged(null)
  const handleDrop = (to: number) => !isNullOrUndefined(dragged) && moveField(dragged, to)

  return (
    <TableHead>
      <TableRow>
        {fields.map((field, i) => {
          const key = (typeof field === 'string' ? field : field.key) as keyof T
          return (
            <DraggableCell
              key={key as string}
              onDragStart={() => handleDragStart(i)}
              onDragEnd={handleDragEnd}
              onDropAfter={() => !isNullOrUndefined(dragged) && dragged !== i && handleDrop(dragged < i ? i : i + 1)}
              onDropBefore={() => !isNullOrUndefined(dragged) && dragged !== i && handleDrop(dragged > i ? i : i - 1)}
              index={i}
              dragged={dragged}
              sortDir={sortField === key ? sortDir : undefined}
              onClick={() => setSortField(key)}
              view={views[key as string]}
              setView={(name: string) => setView(key as string, name)}
            >
              {typeof field === 'string' ? field : (field.display || field.key)}
            </DraggableCell>
          )
        })}
      </TableRow>
    </TableHead>
  )
}

export default DataTableHead