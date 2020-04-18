import React from 'react';
import './number-display.scss'

interface NumberDisplayProps{
    value:number
}


const NumberDisplay:React.FC<NumberDisplayProps> = ({value}) => {
    return (
        < div className="Number-Display">{value.toString().padStart(3,"0")}</div>
    )

}

export default NumberDisplay