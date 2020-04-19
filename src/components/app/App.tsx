import React, { useState } from 'react';
import './App.scss';
import NumberDisplay from '../number-display/number-display';
import { generateCells } from '../../utills/index';
import Button from '../button/Button';


const App: React.FC = () => {

    const [cells, setCells] = useState(generateCells());
    console.log("cells ", cells);

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => {
            return row.map((cell, colIndex) => {
                return <Button key={`${rowIndex}-${colIndex}`} state={cell.state} value={cell.value} row={rowIndex}  col={colIndex}/>
            })
        })
    }


    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={0} />
                <div className="Face"><span role="img" aria-label="face">
                    🙂</span>
                </div>
                <NumberDisplay value={23} />
            </div>
            <div className="Body">{renderCells()}</div>
        </div>
    )
}

export default App;