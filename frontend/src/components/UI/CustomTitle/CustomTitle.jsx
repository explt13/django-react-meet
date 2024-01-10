import React, { useEffect, useRef, useState } from 'react'
import classes from './CustomTitle.module.css'

const CustomTitle = ({data, children}) => {
    const [position, setPosition] = useState({top: 0, left: 0})
    const [visible, setVisible] = useState(false)
    const [titleClasses, setTitleClasses] = useState([classes.titleContainer])
    const mainContainerRef = useRef(null)
    const titleContainerRef = useRef(null)
    let timeID;

    const calculatePosition = () => {
        if (titleContainerRef.current) {
          const rect = mainContainerRef.current.getBoundingClientRect();
          const titleStyles = window.getComputedStyle(titleContainerRef.current)
          const offsetY = `calc(-${titleStyles.height} + 30px)`// Adjust as needed
          const offsetX = `calc((${rect.width}px - ${titleStyles.width}) / 2)` // Center horizontally
          setPosition({
            top: offsetY,
            left: offsetX,
          });
        }
      };


    const handleMouseEnter = () => {

      timeID = setTimeout(() => {
        setVisible(true)
      }, 250) // if half a second mouse on element
    }

    const handleMouseLeave = () => {
      clearTimeout(timeID)
      setTitleClasses(prevClasses => [...prevClasses, classes.leave])
      setTimeout(() => {
        setVisible(false)
        setTitleClasses([classes.titleContainer])
      }, 400)


    }
  
    useEffect(() => {
      calculatePosition();
      window.addEventListener('resize', calculatePosition);
  
      return () => {
        window.removeEventListener('resize', calculatePosition);
      };
    }, [visible]);

  return (
      <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={classes.container}
      ref={mainContainerRef}
      >
        {visible &&
        <div
        className={titleClasses.join(' ')} ref={titleContainerRef}
        style={{ top: position.top, left: position.left }}
        >
          <div className={classes.titleContent}>{data}</div>
          <div className={classes.titleFooter}></div>
        </div>
        }
        {children}
      </div>
  )
}

export default CustomTitle