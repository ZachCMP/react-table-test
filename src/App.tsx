import React from 'react'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import Theming from './Theming'
import fields from './specs/fields'

import { Datum } from './specs/types'

import DataTable from './DataTable'

import useData from './useData'

function App() {
  const [ data, sortField, sortDir, { changeSortField } ] = useData()
  return (
    <Theming>
      <Container>
        <Box py={3}>
          <Typography variant="h1">Table Test</Typography>
          <Paper>
            <DataTable<Datum>
              data={data}
              fields={fields}
              sortField={sortField}
              sortDir={sortDir}
              setSortField={changeSortField}
            />
          </Paper>
        </Box>
      </Container>
    </Theming>
  );
}

export default App;
