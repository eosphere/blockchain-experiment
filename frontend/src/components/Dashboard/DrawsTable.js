import React from 'react';
import moment from 'moment';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
} from '@material-ui/core';
import { DrawActions } from '../Admin';
import { useSelector } from 'react-redux';

const columns = [
  {
    label: 'Draw No.',
    key: 'drawnumber',
    order: 0
  },
  {
    label: 'Winning Numbers',
    key: 'winningnumbers',
    order: 1
  },
  {
    label: 'Draw Status',
    key: 'open',
    order: 2
  },
  {
    label: 'Created Date',
    key: 'created_date',
    order: 3
  },
  {
    label: 'Last Modified Date',
    key: 'last_modified_date',
    order: 4
  },
  {
    label: 'Draw Admin',
    key: 'actions',
    order: 5
  }
];

const useStyles = makeStyles(theme => ({
  cell: {
    textAlign: 'center'
  },
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

const DrawStatus = ({ status }) => {
  const label = status === 1 ? 'Open' : 'Closed';
  return <Chip label={label} variant="outlined" size="small" />;
};

const renderCell = (key, value, draw, wallet) => {
  if (key.includes('actions')) return <DrawActions draw={draw} wallet={wallet} />;
  if (key.includes('open')) return <DrawStatus status={value} />;
  if (key.includes('winningnumbers')) return <Numbers numbers={value} />;
  if (key.includes('date'))
    return moment
      .utc(value)
      .local()
      .format('DD/MM/YYYY hh:mm A');
  return value;
};

const ignoreColumn = (isAdmin, key, matchKey) => {
  return !isAdmin && key === matchKey;
};

const TableComponent = ({ rows, wallet }) => {
  const classes = useStyles();
  const isAdmin = useSelector(state => state.currentAccount.account.name) === 'numberselect';
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns
            .sort((a, b) => a.order - b.order)
            .map(column => {
              if (ignoreColumn(isAdmin, column.key, 'actions')) return null;
              return (
                <TableCell className={classes.cell} key={column.key}>
                  {column.label}
                </TableCell>
              );
            })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows &&
          rows.map(row => (
            <TableRow key={row.drawnumber}>
              {columns
                .sort((a, b) => a.order - b.order)
                .map(column => {
                  if (ignoreColumn(isAdmin, column.key, 'actions')) return null;
                  return (
                    <TableCell className={classes.cell} key={column.key}>
                      {renderCell(column.key, row[column.key], row, wallet)}
                    </TableCell>
                  );
                })}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
