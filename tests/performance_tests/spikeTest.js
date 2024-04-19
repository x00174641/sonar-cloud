import http from 'k6/http';
import {sleep} from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 2000 },
    { duration: '30s', target: 0 },
  ],
};

export default () => {
  const urlRes = http.get('https://staging.clipr.solutions/');
  sleep(1);
};
