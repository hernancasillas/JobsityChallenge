import {StyleSheet} from 'react-native';
import Colors from './colors';

export const customTextes = {
  enter: {
    subTitle: 'Enter PIN to access.',
    footerText: 'Forgot or want to change PIN?',
  },
  set: {
    subTitle: `Enter ${4} digits.`,
  },
  locked: {
    title: 'Locked',
    subTitle:
      'Wrong PIN {{maxAttempt}} times.\nTemporarily locked in {{lockDuration}}.',
  },
  reset: {
    title: 'Forgot or want to change PIN?',
    subTitle:
      'Removing or changing the PIN will remove all your favorite shows!',
  },
};

export const EnterAndSet = {
  header: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 100,
  },
  title: {fontSize: 24},
  buttonText: {
    color: Colors.backgroundColor_dark,
  },
};

export const Reset = {
  confirmText: {
    color: Colors.backgroundColor_dark,
  },
};

export const customStyles = {
  main: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
    backgroundColor: Colors.backgroundColor_dark,
  },
  enter: {
    ...EnterAndSet,

    buttonTextDisabled: {color: 'gray'},
  },
  set: EnterAndSet,
  locked: {
    countdown: {borderColor: 'white'},
  },
  reset: {
    ...Reset,
    confirmText: {color: 'red'},
    resetButton: {
      color: Colors.backgroundColor_dark,
    },
  },
};
