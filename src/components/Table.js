import React, { useMemo, useEffect, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import Rating from '@mui/material/Rating';
import {serverURL} from './constants';
import { MRT_Localization_EN } from 'material-react-table/locales/en';

const Table = () => {
  //should be memoized or stable
  const [data, setData] = useState([]); 
  useEffect(() => {
    async function getPuzzles() {
        const response = await fetch(serverURL + '/puzzle-list')
        if (!response.ok) {
            window.alert("An error occured retrieving puzzle information.")
        } else {
            let puzzles = await response.json();
            setData(puzzles);
        }
    }
    getPuzzles();
  }, []);
  const columns = useMemo(
    () => [
     {
      accessorKey: 'name', //access nested data with dot notation
      header: 'Puzzle Name',
      muiTableHeadCellProps: {
        align: 'center',
      },
      muiTableBodyCellProps: {
        align: 'center',
      },
      Cell: ({row}) => (
        <a href = {`/fpf06/solve-puzzle?id=${row.original.id}`}>
          {row.original.name}
        </a>
      )
    },
      {
        accessorKey: 'variant', //access nested data with dot notation
        header: 'Variant Type',
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorFn: mapDifficulty,
        header: 'Difficulty',
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        sortingFn: (rowA, rowB, columnId) => { // custom sorting function for string difficulties
          if (rowA.getValue(columnId) === "easy" && rowB.getValue(columnId) === "medium") return -1;
          if (rowA.getValue(columnId) === "medium" && rowB.getValue(columnId) === "hard") return -1;
          if (rowA.getValue(columnId) === "hard" && rowB.getValue(columnId) === "medium") return 1; 
          if (rowA.getValue(columnId) === "medium" && rowB.getValue(columnId) === "easy") return 1;
          return 0;
        }
      },
      { // sumRatings, numRatings
        accessorFn: (row) => row.numRatings !== 0 ? row.sumRatings / row.numRatings : 0,
        header: 'Rating',
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
          sx: {
            fontSize: '12px'
          }
        },
        muiTableBodyProps: {
          align: 'center',
        },
        Cell: ({row}) => (
          <div>
          <Rating 
            name="read-only" 
            value={row.original.numRatings !== 0 ? row.original.sumRatings / row.original.numRatings : 0} 
            precision={0.5}
            size="medium"
            readOnly 
          />
          ({row.original.numRatings})
          </div>
          
        )
      },
      {
        accessorFn: (row) => new Date(row.createDate).toLocaleString(), // normal accessorKey
        header: 'Date Created',
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      }, 
      
    ],
    [],

  );

  return <MaterialReactTable 
          columns={columns} 
          data={data}
          initialState={{density: 'comfortable'}}
          enablePagination={false}
          enableBottomToolbar={false}
          muiTableProps={{
            sx: {
              tableLayout: 'fixed',
              fontSize: '5px'
            }
          }}
          muiTableHeadCellProps={{
            sx: {
              // fontSize: '50%'
            }
          }}
          localization={MRT_Localization_EN}

          />;
};

function mapDifficulty(row) {
  let diff = row.difficulty;
  if (diff === 1) {
    return "easy";
  } else if (diff === 5) {
    return "medium";
  } else if (diff === 10) {
    return "hard";
  }
}

export default Table;
