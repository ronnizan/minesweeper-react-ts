import React from 'react';
import './number-display.scss'

interface NumberDisplayProps{
    value:number
}


const NumberDisplay:React.FC<NumberDisplayProps> = ({value}) => {
    return (
        < div className="Number-Display">{value < 0 ? `-${Math.abs(value).toString().padStart(2,'0')}` : value.toString().padStart(3,"0")}</div>
    )

}

export default NumberDisplay