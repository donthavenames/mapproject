import React, { useState } from 'react'
import styles from './styles.module.css'


interface MainProps {
  actionCancel: () => void
  actionSave: (note:string) => void
  currNote?: string
}

const MainModal = ({actionCancel, actionSave, currNote}:MainProps) => {
  const [note, setNote] = useState(currNote || '')

  return <div className={styles.MeetupModal}>
    <div className="area-info">
      <p>Meetup</p>
      <p>Meetup Time & Note</p>
      <textarea
        onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => {
          setNote(e.target.value)
        }}
        value={note}
      ></textarea>
      <div className="area-btns">
        <button
          className="btn-cancel"
          onClick={() => {
            actionCancel();
          }}
        >Cancel</button>
        <button
          className="btn-save"
          onClick={() => {
            actionSave(note);
          }}
        >Save</button>
        
      </div>
    </div>
  </div>
}

export {
  MainModal as default
}
