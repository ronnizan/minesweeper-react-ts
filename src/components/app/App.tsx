import React, { useState } from 'react';
import './App.scss';
import NumberDisplay from '../number-display/number-display';
import { genrateCells } from '../../utills/index';
import Button from '../button/Button';


const App: React.FC = () => {

    const [cells, setCells] = useState(genrateCells());

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => {
           return row.map((cell, colIndex) => {
               return <Button key={`${rowIndex}-${colIndex}`} />
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