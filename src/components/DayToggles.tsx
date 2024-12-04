import React, { useState } from 'react'
import styles from "@/styles/DayToggles.module.css"

interface OperationalTiming {
  openTime: string,
  closeTime: string
}

interface DayData {
  day: string,
  isOpen: boolean,
  operationalTiming: OperationalTiming
}

interface Data {
  data: DayData,
  setOperationalTiming: React.Dispatch<React.SetStateAction<DayData[]>>,
  setIsOpenAllDay: React.Dispatch<React.SetStateAction<boolean>>
}
const DayToggles = ({ data, setOperationalTiming, setIsOpenAllDay }: Data) => {

  const [isOpenFormatError, setIsOpenFormatError] = useState<boolean>(true)
  const [isCloseFormatError, setIsCloseFormatError] = useState<boolean>(true)

  const handleToggle = (itemData: DayData) => {

    setOperationalTiming((prev: DayData[]) => {
      const updatedData = prev.map((item: DayData) => {
        if (item?.day === itemData?.day) {
          return {
            ...item,
            isOpen: !item?.isOpen
          }
        }
        return item
      })

      const allOpen = updatedData?.every((item) => item?.isOpen)
      if (allOpen) {
        setIsOpenAllDay(true)
      }
      else {
        setIsOpenAllDay(false)
      }
      return updatedData
    })
  }


  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^(0?[1-9]|1[0-2]):([0-5][0-9]) ?([AP][M])$/

    if (!regex.test(e.target.value) && e.target.value) {
      e.target.id === 'open' ?
        setIsOpenFormatError(false) : setIsCloseFormatError(false)

    } else {
      e.target.id === 'open' ?
        setIsOpenFormatError(true) : setIsCloseFormatError(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, day: string) => {

    setOperationalTiming((prev: DayData[]) => {
      const updatedData = prev.map((item: DayData) => {
        if (item?.day === day) {
          return {
            ...item,
            operationalTiming: {
              openTime: e.target.id === 'open' ? e.target.value : item?.operationalTiming?.openTime,
              closeTime: e.target.id === 'close' ? e.target.value : item?.operationalTiming?.closeTime
            }
          }
        }
        return item
      })


      return updatedData
    })
  }

  return (
    <div className={styles.DayTogglesParent}>
      <div className={styles.toogleSwitch}>
        <label htmlFor={`toggle-${data?.day}`} className={styles.slider}>{data?.day}</label>
        <input type="checkbox" id={`toggle-${data?.day}`} checked={data?.isOpen} onChange={() => handleToggle(data)} />
      </div>
      {data?.isOpen &&
        <div className={styles.openCloseInput}>
          <input type="text" placeholder='Opening Time' value={data?.operationalTiming?.openTime} id='open' onBlur={(e) => handleTimeInput(e)} onChange={(e) => handleChange(e, data?.day)} />
          {!isOpenFormatError && <span title='Format should be HH:MM AM/PM' className={styles.errorSymbol}>❗</span>}
          <input type="text" placeholder='closing Time' id='close' value={data?.operationalTiming?.closeTime} onBlur={(e) => handleTimeInput(e)} onChange={(e) => handleChange(e, data?.day)} />
          {!isCloseFormatError && <span title='Format should be HH:MM AM/PM' className={styles.errorSymbol}>❗</span>}
        </div>}
    </div>
  )
}

export default DayToggles