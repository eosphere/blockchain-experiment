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

const columns = [
  {
    label: 'Serial No.',
    key: 'serialno',
    order: 0
  },
  {
    label: 'Purchaser',
    key: 'purchaser',
    order: 7
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
    order: 8
  },
  {
    label: 'Purchase Date',
    key: 'created_date',
    order: 9
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

const TicketStatus = ({ status }) => {
  let label;
  if (status === 0) label = 'Purchased';
  else if (status === 1) label = 'Cancelled';
  else if (status === 1) label = 'Claimed';
  return label ? <Chip label={label} variant="outlined" size="small" /> : null;
};

const WinningTier = ({ tier }) => {
  return tier !== 0 ? <Chip label={tier} variant="outlined" size="small" /> : '-';
};

const Store = ({ id }) => {
  return id === 0 ? 'Online' : id;
};

const renderCell = (key, value) => {
  if (key.includes('store')) return <Store id={value} />;
  if (key.includes('price')) return `$${value}`;
  if (key.includes('winningtier')) return <WinningTier tier={value} />;
  if (key.includes('ticket_status')) return <TicketStatus status={value} />;
  if (key.includes('entrynumbers')) return <Numbers numbers={value} />;
  if (key.includes('date'))
    return moment
      .utc(value)
      .local()
      .format('DD/MM/YYYY hh:mm A');
  return value;
};

const TableComponent = ({ rows }) => {
  const classes = useStyles();
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns
            .sort((a, b) => a.order - b.order)
            .map(column => (
              <TableCell className={classes.cell} key={column.key}>
                {column.label}
              </TableCell>
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
                  <TableCell className={classes.cell} key={column.key}>
                    {renderCell(column.key, row[column.key])}
                  </TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
