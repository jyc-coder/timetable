import { atom } from 'recoil';

export const timeTableState = atom({
  key: 'timeTableState',
  default: {
    mon: [{ start: 9, end: 11, name: '교양', color: 'red', id: 1 }],
    tue: [{ start: 9, end: 12, name: '수학', color: 'orange', id: 2 }],
    wed: [{ start: 9, end: 13, name: '영어', color: 'yellow', id: 3 }],
    thu: [{ start: 9, end: 14, name: '물리', color: 'green', id: 4 }],
    fri: [{ start: 9, end: 15, name: '지구과학', color: 'blue', id: 5 }],
  },
});
