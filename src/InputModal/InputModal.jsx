import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { timeTableState } from '../store/store';
import { v4 as uuidv1 } from 'uuid';
import { useEffect } from 'react';

const timeOptions = new Array(12).fill(null).map((e, i) => ({
  value: i + 9,
  label: i + 9,
}));

const checkOverLap = (A, B) =>
  B.start < A.start ? B.end > A.start : B.start < A.end;


function InputModal({
  showModal,
  handleClose,
  dayData = 'mon',
  startTimeData = 9,
  endTimeData = 10,
  lectureNameData = '',
  colorData = '#FFFFFF',
  idNum,
}) {

function InputModal({ showModal, handleClose }) {

  const {
    formState: { errors },
    control,
    getValues,
    handleSubmit,
    reset,
  } = useForm();
  const [timeTableData, setttimeTableData] = useRecoilState(timeTableState);
  useEffect(() => {
    if (showModal) {
      reset({

        lecturename: lectureNameData,
        day: dayData,
        startTime: startTimeData,
        endTime: endTimeData,
        lectureColor: colorData,
      });
    }
  }, [
    colorData,
    dayData,
    endTimeData,
    lectureNameData,
    reset,
    showModal,
    startTimeData,
  ]);

        lecturename: '',
        day: 'fri',
        startTime: 9,
        endTime: 10,
        lectureColor: '#FFFFFF',
      });
    }
  }, [reset, showModal]);

  const Submit = useCallback(
    ({ lectureName, day, startTime, endTime, lectureColor }) => {
      let valid = true;
      for (let index = 0; index < timeTableData[day].length; index++) {
        if (
          checkOverLap(timeTableData[day][index], {
            start: startTime,
            end: endTime,
          })
        ) {
          valid = false;
          break;
        }
      }

      if (!valid) {
        alert('해당 시간대에 이미 강의가 있어. 다시 확인해봐 ');
        return;
      }

      const data = {
        start: startTime,
        end: endTime,
        name: lectureName,
        color: lectureColor,
        id: uuidv1(),
      };

      setttimeTableData((oldTimeData) => ({
        ...oldTimeData,
        [day]: [...oldTimeData[day], data],
      }));

      handleClose();
    },
    [handleClose, setttimeTableData, timeTableData],
  );


  const Edit = useCallback(
    ({ lectureName, day, startTime, endTime, lectureColor }) => {
      let valid = true;

      for (let index = 0; index < timeTableData[day].length; index++) {
        if (
          checkOverLap(timeTableData[day][index], {
            start: startTime,
            end: endTime,
          }) &&
          timeTableData[day][index]['id'] !== idNum
        ) {
          valid = false;
          break;
        }
      }

      if (!valid) {
        alert('해당 시간대에 이미 강의가 있어. 다시 확인해봐 ');
        return;
      }
      const filteredDayData = [
        ...timeTableData[dayData].filter((data) => data.id !== idNum),
      ];

      const newTimeTableData = {
        ...timeTableData,
        [dayData]: filteredDayData,
      };
      const newDayData = [
        ...newTimeTableData[day],
        {
          start: startTime,
          end: endTime,
          id: idNum,
          name: lectureName,
          color: lectureColor,
        },
      ];

      setttimeTableData({
        ...newTimeTableData,
        [day]: newDayData,
      });

      handleClose();
    },
    [dayData, handleClose, idNum, setttimeTableData, timeTableData],
  );
  return (
    <Dialog open={showModal} onClose={handleClose}>
      <form onSubmit={handleSubmit(idNum ? Edit : Submit)}>

  return (
    <Dialog open={showModal} onClose={handleClose}>
      <form onSubmit={handleSubmit(Submit)}>

        <DialogTitle align="center"> 강의 정보 입력</DialogTitle>
        <DialogContent style={{ width: '400px' }}>
          <Controller
            control={control}
            name="lectureName"
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.lectureName}
                style={{ marginTop: '30px', width: '350px' }}
                autoComplete="off"
                label="강의명"
              />
            )}
          />
          {errors.lectureName?.type === 'required' && (
            <p style={{ color: '#d32f2f' }}>무슨 강의인데?</p>
          )}
          <FormControl style={{ marginTop: '30px' }}>
            <FormLabel>요일</FormLabel>
            <Controller
              control={control}
              name="day"
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup {...field} style={{ display: 'block' }}>
                  <FormControlLabel
                    value="mon"
                    control={<Radio />}
                    label="월"
                  />
                  <FormControlLabel
                    value="tue"
                    control={<Radio />}
                    label="화"
                  />
                  <FormControlLabel
                    value="wed"
                    control={<Radio />}
                    label="수"
                  />
                  <FormControlLabel
                    value="thu"
                    control={<Radio />}
                    label="목"
                  />
                  <FormControlLabel
                    value="fri"
                    control={<Radio />}
                    label="금"
                  />
                </RadioGroup>
              )}
            />
            {errors.day?.type === 'required' && (
              <p style={{ color: '#d32f2f' }}> 무슨 요일에 시작하는데?</p>
            )}
          </FormControl>
          <Stack spacing={3} style={{ marginTop: '30px', width: '350px' }}>
            <Controller
              control={control}
              name="startTime"
              rules={{
                required: true,
                validate: (value) => getValues('endTime') > value,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  error={
                    !!errors.startTime ||
                    !!(errors.endTime?.type === 'validate')
                  }
                  style={{ marginTop: '30px', width: '350px' }}
                  label="시작 시간"
                  placeholder="몇시 수업?"
                >
                  {timeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {errors.startTime?.type === 'required' && (
              <p style={{ color: '#d32f2f' }}> 몇시에 시작하는데?</p>
            )}
            {errors.startTime?.type === 'validate' && (
              <p style={{ color: '#d32f2f' }}> 시간설정 이상한데?</p>
            )}

            <Controller
              control={control}
              name="endTime"
              rules={{
                required: true,
                validate: (value) => getValues('startTime') < value,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  error={!!errors.endTime}
                  style={{ marginTop: '30px', width: '350px' }}
                  label="종료 시간"
                  placeholder="몇시에 끝나?"
                >
                  {timeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {errors.endTime?.type === 'required' && (
              <p style={{ color: '#d32f2f' }}> 몇시에 끝나는데?</p>
            )}
            {errors.endTime?.type === 'validate' && (
              <p style={{ color: '#d32f2f' }}> 시간설정 이상한데?</p>
            )}
          </Stack>
          <div style={{ marginTop: '30px' }}>
            <label htmlFor="lectureColor">시간표 색상:</label>
            <Controller
              control={control}
              name="lectureColor"
              render={({ field }) => (
                <input
                  {...field}
                  style={{ marginLeft: '30px' }}
                  id="lectureColor"
                  type="color"
                />
              )}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button type="submit">입력</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default InputModal;
