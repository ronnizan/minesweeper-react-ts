import React, { useState, useEffect } from 'react';
import './App.scss';
import NumberDisplay from '../number-display/number-display';
import { generateCells, openMultipleCells } from '../../utills/index';
import Button from '../button/Button';
import { Face, Cell, CellState, CellValue } from '../../types/index';
import { MAX_ROWS, MAX_COLS } from '../../constants/index';


const App: React.FC = () => {

    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [life, setLife] = useState<boolean>(false);
    const [flagCounter, setFlagCounter] = useState<number>(10);
    const [didLost, setDidLost] = useState<boolean>(false);
    const [didWon, setDidWon] = useState<boolean>(false);

    useEffect(() => {
        const handleMousedown = () => {
            setFace(Face.worried)
        }

        const handleMouseUp = () => {
            setFace(Face.smile)
        }

        window.addEventListener('mousedown', handleMousedown);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousedown', handleMousedown)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    useEffect(() => {
        if (life && time < 999) {
            const timer = setInterval(() => {
                setTime(time + 1)
            }, 1000);

            return () => {
                clearInterval(timer)
            }
        }
    }, [life, time])


    useEffect(() => {
        if (didLost) {
            setFace(Face.lost);
            setLife(false);

        }
    }, [didLost])

    useEffect(() => {
        if (didWon) {
            setLife(false);
            setFace(Face.won);
        }
    }, [didWon])

    const handleCellClick = (rowParam: number, colParam: number) => (): void => {
        let newCells = cells.slice();
        if (!life) {

            let isBomb = newCells[rowParam][colParam].value === CellValue.bomb;
            while (isBomb) {
                newCells = generateCells();
                if (newCells[rowParam][colParam].value !== CellValue.bomb) {
                    isBomb = false;
                    break;

                }
            }
            setLife(true);


        }

        const currentCell = newCells[rowParam][colParam];


        if (currentCell.state === CellState.flagged || currentCell.state === CellState.visible) {
            return
        }

        if (currentCell.value === CellValue.bomb) {
            setDidLost(true)
            newCells[rowParam][colParam].red = true
            newCells = showBombsAfterLoss();
            setCells(newCells);

            return;
        }
        else if (currentCell.value === CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam, colParam);
        }
        else {
            newCells[rowParam][colParam].state = CellState.visible;
        }
        let safeOpenSpaceExist = false;
        for (let row = 0; row < MAX_ROWS; row++) {
            for (let col = 0; col < MAX_COLS; col++) {
                const currentCell = newCells[row][col]
                if (currentCell.value !== CellValue.bomb && currentCell.state === CellState.open) {
                    safeOpenSpaceExist = true;
                    break;
                }

            }
        }
        if (!safeOpenSpaceExist) {
            newCells = newCells.map(row => row.map(cell => {
                if (cell.value === CellValue.bomb) {
                    return {
                        ...cell,
                        state: CellState.flagged
                    }
                }
                return cell
            }))
            setDidWon(true);
        }
        setCells(newCells);

    }


    const handleRightClick = (rowParam: number, colParam: number) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault();
        if (!life) {
            return
        }
        const currentCells = cells.slice();
        const currentCell = cells[rowParam][colParam]
        if (currentCell.state === CellState.visible) {
            return;
        }
        else if (currentCell.state === CellState.open) {
            currentCells[rowParam][colParam].state = CellState.flagged;
            setCells(currentCells);
            setFlagCounter(flagCounter - 1)
        } else if (currentCell.state === CellState.flagged) {
            currentCells[rowParam][colParam].state = CellState.open;
            setCells(currentCells);
            setFlagCounter(flagCounter + 1)


        }
    }



    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => {
            return row.map((cell, colIndex) => {
                return <Button key={`${rowIndex}-${colIndex}`}
                    state={cell.state} value={cell.value}
                    row={rowIndex}
                    col={colIndex}
                    onClick={handleCellClick}
                    onContext={handleRightClick}
                    red={cell.red} />
            })
        })
    }
    const handleFaceClick = () => {
        setLife(false);
        setTime(0);
        setCells(generateCells())
        setDidLost(false);
        setDidWon(false)
        setFlagCounter(10);
    }

    const showBombsAfterLoss = (): Cell[][] => {
        const currentCells = cells.slice();
        return currentCells.map(row => row.map(cell => {
            if (cell.value === CellValue.bomb) {
                setTimeout(() => {
                    setLife(false);
                    setTime(0);
                    setCells(generateCells())
                    setDidLost(false);
                    setDidWon(false)
                    setFlagCounter(10);
                }, 2000);
                return {
                    ...cell,
                    state: CellState.visible
                }
            }
            return cell
        }))
    }

    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={flagCounter} />
                <div className="Face" onClick={handleFaceClick}>
                    <span role="img" aria-label="face">
                        {face}
                    </span>
                </div>
                <NumberDisplay value={time} />
            </div>
            <div className="Body">{renderCells()}</div>
        </div>
    )
}

export default App;