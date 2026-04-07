let difficulty = miniMenu.createMenu(miniMenu.createMenuItem("Easy"), miniMenu.createMenuItem("Medium"), miniMenu.createMenuItem("Hard"))
let title = textsprite.create("Minesweeper")
title.setPosition(80, 30)


scene.setBackgroundColor(12)
let DIFFICULTY = 0
let easyTilemap = assets.tilemap`easy`
let mediumTilemap = assets.tilemap`medium`
let hardTilemap = assets.tilemap`hard`
let cursorSprite: Sprite = null
let flags = 0
let _board: number[][] = []
let revealedBoard: boolean[][] = []
let gameStart = false
let timer = 0

let flagSprite: TextSprite = null
let timerSprite: TextSprite = null

function zeroPad(num: number, size: number) {
    let s = num.toString()
    while (s.length < size) {
        s = "0" + s
    }
    return s
}

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (DIFFICULTY == 0) {
        return
    }
    if (DIFFICULTY != 0 && cursorSprite) {
        if (tiles.tileAtLocationEquals(cursorSprite.tilemapLocation(), assets.tile`unturned`)) {
            tiles.setTileAt(cursorSprite.tilemapLocation(), assets.tile`flag`)
            flags -= 1
            flagSprite.setText(zeroPad(flags, 2))
        } else if (tiles.tileAtLocationEquals(cursorSprite.tilemapLocation(), assets.tile`flag`)) {
            tiles.setTileAt(cursorSprite.tilemapLocation(), assets.tile`unturned`)
            flags += 1
            flagSprite.setText(zeroPad(flags, 2))
        }
    }
})

function floodTiles(row: number, col: number) {
    let neighbors: number[][] = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ]
    if (row < 0 || row >= _board.length || col < 0 || col >= _board[0].length) {
        return
    }
    if (revealedBoard[row][col] || tiles.tileAtLocationEquals(tiles.getTileLocation(col, row), assets.tile`flag`)) {
        return
    }
    revealedBoard[row][col] = true
    revealTile(row, col)

    if (_board[row][col] > 0) {
        return
    }
    for (let offset of neighbors) {
        floodTiles(row + offset[1], col + offset[0])
    }
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (DIFFICULTY == 0) {
        return
    }
    if (gameStart && cursorSprite) {
        if (_board.length == 0) {
            return
        }
        let pos = cursorSprite.tilemapLocation()
        if ((pos.row < 0 || pos.row > tileUtil.currentTilemap().height) && (pos.col < 0 || pos.col > tileUtil.currentTilemap().width)) {
            return
        }
        if (revealedBoard[pos.row][pos.col] || tiles.tileAtLocationEquals(tiles.getTileLocation(pos.col, pos.row), assets.tile`flag`)) {
            return
        }
        if (_board[pos.row][pos.col] == -1) {
            for (let _ = 0; _ < tileUtil.currentTilemap().height; _++) {
                for (let c = 0; c < tileUtil.currentTilemap().width; c++) {
                    if (_board[_][c] == -1) {
                        tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`bomb`)
                    }
                }
            }
            pause(100)
            game.gameOver(false)
            return
        }
        if (_board[pos.row][pos.col] > 0) {
            revealTile(pos.row, pos.col)
            revealedBoard[pos.row][pos.col] = true
            return
        }
        floodTiles(pos.row, pos.col)
    }
})

function revealTile(row: number, col: number) {
    if (_board[row][col] == 0) {
        tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`blank`)
    } else if (_board[row][col] == 1) {
        tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`one`)
    } else if (_board[row][col] == 2) {
        tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`two`)
    } else if (_board[row][col] == 3) {
        tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`three`)
    } else if (_board[row][col] == 4) {
        tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`four`)
    } else if (_board[row][col] == 5) {
        tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`five`)
    } else if (_board[row][col] == 6) {
        tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`six`)
    } else if (_board[row][col] == 7) {
        tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`seven`)
    } else if (_board[row][col] == 8) {
        tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`eight`)
    }
}

/*
                if (_board[_][c] == -1) {
                    tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`bomb`)
                } else if (_board[_][c] == 0) {
                    tiles.setTileAt(tiles.getTileLocation(c , _), assets.tile`blank`)
                } else if (_board[_][c] == 1) {
                    tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`one`)
                } else if (_board[_][c] == 2) {
                    tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`two`)
                } else if (_board[_][c] == 3) {
                    tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`three`)
                } else if (_board[_][c] == 4) {
                    tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`four`)
                } else if (_board[_][c] == 5) {
                    tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`five`)
                } else if (_board[_][c] == 6) {
                    tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`six`)
                } else if (_board[_][c] == 7) {
                    tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`seven`)
                } else if (_board[_][c] == 8) {
                    tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`eight`)
                }
*/

difficulty.onButtonPressed(controller.A, function (selection: string, selectedIndex: number) {
    cursorSprite = sprites.create(assets.image`cursor`, SpriteKind.Player)
    controller.moveSprite(cursorSprite, 150, 150)
    scene.cameraFollowSprite(cursorSprite)
    cursorSprite.setFlag(SpriteFlag.StayInScreen, true)
    timerSprite = textsprite.create("0")
    timerSprite.setPosition(110, 20)
    timerSprite.scale = 3
    timerSprite.setFlag(SpriteFlag.RelativeToCamera, true)
    flagSprite = textsprite.create("0")
    flagSprite.setPosition(50, 20)
    flagSprite.scale = 3
    flagSprite.setFlag(SpriteFlag.RelativeToCamera, true)
    if (selection == "Easy") {
        DIFFICULTY = 1
        tiles.setCurrentTilemap(easyTilemap)
        let result = generateBoard(DIFFICULTY, 8, 10, 10)
        flags = 10
        _board = result.board
        revealedBoard = result.revealed
        for (let _ = 0; _ < 8; _++) {
            for (let c = 0; c < 10; c++) {
                tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`unturned`)
            }
        }
    } else if (selection == "Medium") {
        DIFFICULTY = 2
        tiles.setCurrentTilemap(mediumTilemap)
        let result = generateBoard(DIFFICULTY, 14, 18, 40)
        flags = 40
        _board = result.board
        revealedBoard = result.revealed
        for (let _ = 0; _ < 14; _++) {
            for (let c = 0; c < 18; c++) {
                tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`unturned`)
            }
        }
    } else if (selection == "Hard") {
        DIFFICULTY = 3
        tiles.setCurrentTilemap(hardTilemap)
        let result = generateBoard(DIFFICULTY, 24, 30, 99)
        flags = 99
        _board = result.board
        revealedBoard = result.revealed 
        for (let _ = 0; _ < 24; _++) {
            for (let c = 0; c < 30; c++) {
                tiles.setTileAt(tiles.getTileLocation(c, _), assets.tile`unturned`)
            }
        }
    }
    difficulty.destroy()
    title.destroy()
    gameStart = true
})

function generateBoard(_difficulty: number, rows: number, cols: number, mines: number): { board: number[][], revealed: boolean[][] } {
    let board: number[][] = []
    let revealBoard: boolean[][] = []
    flagSprite.setText(zeroPad(mines, 2))
    for (let _ = 0; _ < rows; _++) {
        let _rowBoard: boolean[] = []
        for (let c = 0; c < cols; c++) {
            _rowBoard[c] = false
        }
        revealBoard[_] = _rowBoard
    }
        for (let _ = 0; _ < rows; _++) {
            let _rowBoard: number[] = []
            for (let c = 0; c < cols; c++) {
                _rowBoard[c] = 0
            }
            board[_] = _rowBoard
        }

        while (mines > 0) {
            let randCol = randint(0, cols - 1)
            let randRow = randint(0, rows - 1)
            if (board[randRow][randCol] == 0) {
                board[randRow][randCol] = -1
                mines -= 1
            } else {
                while (board[randRow][randCol] != 0) {
                    randCol = randint(0, cols - 1)
                    randRow = randint(0, rows - 1)
                    if (board[randRow][randCol] == 0) {
                        board[randRow][randCol] = -1
                        mines -= 1
                        break
                    }
                }
            }
        }
        let newBoard = board
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c] == -1) {
                    continue
                } else {
                    let count = 0
                    if (c - 1 >= 0 && board[r][c - 1] == -1) {
                        count += 1
                    }
                    if (c - 1 >= 0 && r - 1 >= 0 && board[r - 1][c - 1] == -1) {
                        count += 1
                    }
                    if (r - 1 >= 0 && board[r - 1][c] == -1) {
                        count += 1
                    }
                    if (c + 1 <= cols - 1 && r - 1 >= 0 && board[r - 1][c + 1] == -1) {
                        count += 1
                    }
                    if (c + 1 <= cols - 1 && board[r][c + 1] == -1) {
                        count += 1
                    }
                    if (c + 1 <= cols - 1 && r + 1 <= rows - 1 && board[r + 1][c + 1] == -1) {
                        count += 1
                    }
                    if (r + 1 <= rows - 1 && board[r + 1][c] == -1) {
                        count += 1
                    }
                    if (c - 1 >= 0 && r + 1 < rows && board[r + 1][c - 1] == -1) {
                        count += 1
                    }
                    newBoard[r][c] = count
                }
            }
        }
        return {
            board: newBoard,
            revealed: revealBoard
        }
}

game.onUpdate(function(){
    if (!gameStart) {
        return
    }
    if (DIFFICULTY == 1) {
        if (tiles.getTilesByType(assets.tile`flag`).length == 10) {
            for (let loc of tiles.getTilesByType(assets.tile`flag`)) {
                if (_board[loc.row][loc.col] != -1) {
                    return
                }
            }
            info.setScore(timer)
            game.gameOver(true)
        }
    } else if (DIFFICULTY == 2) {
        if (tiles.getTilesByType(assets.tile`flag`).length == 40) {
            for (let loc of tiles.getTilesByType(assets.tile`flag`)) {
                if (_board[loc.row][loc.col] != -1) {
                    return
                }
            }
            info.setScore(timer)
            game.gameOver(true)
        }
    } else if (DIFFICULTY == 3) {
        if (tiles.getTilesByType(assets.tile`flag`).length == 40) {
            for (let loc of tiles.getTilesByType(assets.tile`flag`)) {
                if (_board[loc.row][loc.col] != -1) {
                    return
                }
            }
            info.setScore(timer)
            game.gameOver(true)
        }
    }
})

game.onUpdateInterval(1000, function(){
    if (!gameStart) {
        return
    }
    timer += 1
    timerSprite.setText(timer.toString())
})