import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import * as _dayjs from 'dayjs';

export const setupDayjs = () => {
  _dayjs.extend(utc);
  _dayjs.extend(timezone);
  _dayjs.extend(localizedFormat);
  _dayjs.extend(customParseFormat);
  _dayjs.tz.guess();
};

export const dayjs = _dayjs;