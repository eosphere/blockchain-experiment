import React from 'react';
import { makeStyles, Button, Box, Tooltip, CircularProgress } from '@material-ui/core';
import { purple, grey } from '@material-ui/core/colors';

import { MdDelete, MdStar } from 'react-icons/md';
import { range, NUMBER_CHOICE_LIMIT, TOTAL_GAME_NUMBERS } from 'utils';

const { createContext, useContext } = React;
const CounterContext = createContext();

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 280
  },
  circle: {
    width: '45px',
    height: '65px',
    borderRadius: '50%',
    boxShadow: 'inset 0 3px 5px 0 rgba(0, 0, 0, 0.2)',
    marginRight: theme.spacing(1),
    color: '#000000de'
  },
  square: {
    background: 'white',
    verticalAlign: 'top',
    border: '1px solid #B2B2B2',
    margin: '-1px -1px 0 0',
    borderRadius: 0,
    color: '#6C4796',
    fontSize: '1rem',
    textAlign: 'center',
    display: 'inline-block',
    cursor: 'pointer',
    '&:hover': {
      background: '#eeeeee'
    }
  },
  loading: {
    color: '#fff'
  },
  active: {
    color: 'white',
    background: theme.palette.secondary.main,
    '&:hover': {
      background: theme.palette.secondary.light
    }
  },
  icon: { color: 'white', width: '25px', height: '25px' },
  random: {
    background: purple[300],
    '&:hover': {
      background: purple[400]
    }
  },
  remove: {
    background: grey[400],
    '&:hover': {
      background: grey[500]
    }
  },
  label: {
    fontWeight: 900,
    fontSize: 18
  }
}));

const NumberCircle = ({ number }) => {
  const { remove } = useContext(CounterContext);
  const classes = useStyles();
  return (
    <Button
      onClick={remove.bind(null, number)}
      className={`${classes.circle} ${number ? classes.active : ''}`}>
      <span className={classes.label}>{number}</span>
    </Button>
  );
};

const NumberSquare = ({ number }) => {
  const classes = useStyles();
  const { remove, add, numbers } = useContext(CounterContext);
  const isActive = numbers.includes(number);
  const onClick = isActive ? remove.bind(null, number) : add.bind(null, number);
  return (
    <Button onClick={onClick} className={`${classes.square} ${isActive ? classes.active : ''}`}>
      <span className={classes.label}>{number}</span>
    </Button>
  );
};

const ClearNumbers = () => {
  const classes = useStyles();
  const { removeAll } = useContext(CounterContext);
  return (
    <Tooltip title="Clear all Numbers">
      <Button onClick={removeAll} className={`${classes.circle} ${classes.remove}`}>
        <MdDelete className={classes.icon} />
      </Button>
    </Tooltip>
  );
};

const RandomNumbers = () => {
  const classes = useStyles();
  const { loading, randomNumbers } = useContext(CounterContext);
  return (
    <Tooltip title="Autopick my numbers">
      <Button onClick={randomNumbers} className={`${classes.circle} ${classes.random}`}>
        {loading ? (
          <CircularProgress className={classes.loading} />
        ) : (
          <MdStar className={classes.icon} />
        )}
      </Button>
    </Tooltip>
  );
};

const NumberSet = () => {
  const numberChoices = [...range(1, NUMBER_CHOICE_LIMIT)];
  const { numbers } = useContext(CounterContext);
  return (
    <Box marginY={1}>
      {numberChoices.map((value, index) => (
        <NumberCircle key={index} number={numbers[index]} />
      ))}
      <RandomNumbers />
      <ClearNumbers />
    </Box>
  );
};

const NumberGrid = () => {
  const totalNumbers = [...range(1, TOTAL_GAME_NUMBERS)];

  return (
    <Box marginY={1} maxWidth="450px">
      {totalNumbers.map((value, index) => (
        <NumberSquare key={index} number={value} />
      ))}
    </Box>
  );
};

const Ticket = ({ loading, numbers, updateNumbers, generateRandomNumbers }) => {
  const remove = value => {
    updateNumbers(numbers.filter(numberValue => numberValue !== value));
  };

  const add = value => {
    if (numbers.length !== 6) return updateNumbers([...numbers, value]);
  };

  const removeAll = () => {
    updateNumbers([]);
  };

  const randomNumbers = () => {
    generateRandomNumbers();
  };

  return (
    <CounterContext.Provider value={{ loading, numbers, remove, removeAll, add, randomNumbers }}>
      <NumberSet />
      <NumberGrid />
    </CounterContext.Provider>
  );
};

export default Ticket;
