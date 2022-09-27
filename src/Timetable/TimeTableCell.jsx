import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TableCell } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { timeTableState } from '../store/store';

function TimeTableCell({ day, timeNum, Edit }) {
  const [timeTableData, settimeTableData] = useRecoilState(timeTableState);
  const [hover, sethover] = useState(false);

  const timeData = useMemo(
    () =>
      timeTableData[day].find(
        (time) => time.start <= timeNum && timeNum < time.end,
      ),
    [day, timeNum, timeTableData],
  );

  const handleEdit = useCallback(
    () => Edit(day, timeData.id),
    [Edit, day, timeData?.id],
  );
  return (
    <>
      {timeData?.start === timeNum ? (
        <TableCell
          style={{ backgroundColor: timeData.color, position: 'relative' }}
          align="center"
          rowSpan={timeData.end - timeData.start}
          onMouseOver={() => sethover(true)}
          onMouseLeave={() => sethover(false)}
        >
          {timeData.name}
          {hover ? (
            <div style={{ position: 'absolute', top: 5, right: 5 }}>
              <EditIcon style={{ cursor: 'pointer' }} onClick={handleEdit} />
              <DeleteIcon style={{ cursor: 'pointer' }} onClick={handleEdit} />
            </div>
          ) : null}
        </TableCell>
      ) : timeData?.start < timeNum && timeNum < timeData?.end ? null : (
        <TableCell />
      )}
    </>
  );
}

export default TimeTableCell;
