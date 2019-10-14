import React from 'react';
import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  {
    label: 'Serial No.',
    key: 'serialno',
    order: 0
  },
  {
    label: 'Purchaser',
    key: 'purchaser',
    order: 1
  },
  {
    label: 'Draw No.',
    key: 'drawnumber',
    order: 2
  },
  {
    label: 'Entry Numbers',
    key: 'entrynumbers',
    order: 3
  },
  {
    label: 'Ticket Status',
    key: 'ticket_status',
    order: 4
  },
  {
    label: 'Winning Div',
    key: 'winningtier',
    order: 5
  },
  {
    label: 'Price',
    key: 'price',
    order: 6
  },
  {
    label: 'Store',
    key: 'storeid',
    order: 7
  },
  {
    label: 'Purchase Date',
    key: 'created_date',
    order: 8
  }
];

const useStyles = makeStyles(theme => ({
  number: {
    width: '30px',
    height: '30px',
    padding: '5px',
    margin: '2px',
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: 'inline-flex',
    justifyContent: 'center',
    borderRadius: '50%',
    fontWeight: 'bold'
  }
}));

const Numbers = ({ numbers }) => {
  const classes = useStyles();

  return (
    <>
      {numbers.map(number => (
        <span className={classes.number} key={number}>
          {number}
        </span>
      ))}
    </>
  );
};

const valuex = (key, value) => {
  if (key.includes('entrynumbers')) return <Numbers numbers={value} />;
  if (key.includes('date')) return dayjs().format('DD/MM/YYYY h:m:s A');
  return value;
};

const TableComponent = ({ rows }) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns
            .sort((a, b) => a.order - b.order)
            .map(column => (
              <TableCell key={column.key}>{column.label}</TableCell>
            ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows &&
          rows.map(row => (
            <TableRow key={row.serialno}>
              {columns
                .sort((a, b) => a.order - b.order)
                .map(column => (
                  <TableCell key={column.key}>{valuex(column.key, row[column.key])}</TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
