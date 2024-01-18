const alfabet = 'abcdefghiklmnopqrstuvwxyz';

export type Matrix = string[][];

export function sanitize(text: string): string {
    return text.toLowerCase()
        .replace(/ /g, '')
        .replace(/j/g, 'i')
}

export function generateKeyTable(key: string): Matrix {
    let mergedArray = key.split('').concat(alfabet.split(''));
    mergedArray = Array.from(new Set(mergedArray));

    const keyTable: Matrix = [];
    for (let i = 0; i < 5; i++){
        keyTable.push([
            mergedArray[0 + i*5],
            mergedArray[1 + i*5],
            mergedArray[2 + i*5],
            mergedArray[3 + i*5],
            mergedArray[4 + i*5]
        ]);
    }
    return keyTable;
}

function search(matrix: Matrix, element: string) {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (matrix[i][j] == element) {
                return [i, j];
            }
        }
    }
}

export function prepareText(text: string) {
    let preparedText = '';
    for (let i = 0; i < text.length; i++) {
        if (i + 1 == text.length){
            preparedText = preparedText + text[i] + 'x';
            break;
        }
        if (text[i] == text[i+1]){
            preparedText = preparedText + text[i] + 'x';
        }
        else {
            preparedText = preparedText + text[i] + text[i+1];
            i++;
        }
    }
    return preparedText;
}


function encrypt_RowRule(matrix: Matrix, ele1_x: number, ele1_y: number, ele2_x: number, ele2_y: number) {
    let char1 = '';
    let char2 = '';
    if (ele1_y == 4){
        char1 = matrix[ele1_x][0];
    } else {
        char1 = matrix[ele1_x][ele1_y+1];
    }
    if (ele2_y == 4){
        char2 = matrix[ele2_x][0];
    } else {
        char2 = matrix[ele2_x][ele2_y+1];
    }
    return char1+char2;
}


function encrypt_ColumnRule(matrix: Matrix, ele1_x: number, ele1_y: number, ele2_x: number, ele2_y: number) {
    let char1 = '';
    let char2 = '';
    if (ele1_x == 4){
        char1 = matrix[0][ele1_y];
    } else {
        char1 = matrix[ele1_x+1][ele1_y];
    }
    if (ele2_x == 4){
        char2 = matrix[0][ele1_y];
    } else {
        char2 = matrix[ele2_x+1][ele2_y];
    }
    return char1+char2;
}



function encrypt_RectangleRule(matrix: Matrix, ele1_x: number, ele1_y: number, ele2_x: number, ele2_y: number) {
    let char1 = '';
    let char2 = '';
    char1 = matrix[ele1_x][ele2_y];
    char2 = matrix[ele2_x][ele1_y];
    return char1+char2;
}


export function encryptByPlayfairCipher(matrix: Matrix, preparedText: string) {
    let cipherText = '';
    for (let i = 0; i < preparedText.length; i += 2) {
        let ele1: any = search(matrix, preparedText[i]);
        let ele2: any = search(matrix, preparedText[i + 1]);

        if(ele1[0]==ele2[0]){
            cipherText = cipherText + encrypt_RowRule(matrix, ele1[0], ele1[1], ele2[0], ele2[1]);
        } else if (ele1[1]==ele2[1]){
            cipherText = cipherText + encrypt_ColumnRule(matrix, ele1[0], ele1[1], ele2[0], ele2[1]);
        } else {
            cipherText = cipherText + encrypt_RectangleRule(matrix, ele1[0], ele1[1], ele2[0], ele2[1]);
        }
    }
    return cipherText;
}

function decrypt_RowRule(matrix: Matrix, ele1_x: number, ele1_y: number, ele2_x: number, ele2_y: number) {
    let char1 = '';
    let char2 = '';
    if (ele1_y == 0){
        char1 = matrix[ele1_x][4];
    } else {
        char1 = matrix[ele1_x][ele1_y-1];
    }
    if (ele2_y == 0){
        char2 = matrix[ele2_x][4];
    } else {
        char2 = matrix[ele2_x][ele2_y-1];
    }
    return char1+char2;
}

function decrypt_ColumnRule(matrix: Matrix, ele1_x: number, ele1_y: number, ele2_x: number, ele2_y: number) {
    let char1 = '';
    let char2 = '';
    if (ele1_x == 0){
        char1 = matrix[4][ele1_y];
    } else {
        char1 = matrix[ele1_x-1][ele1_y];
    }
    if (ele2_x == 0){
        char2 = matrix[4][ele1_y];
    } else {
        char2 = matrix[ele2_x-1][ele2_y];
    }
    return char1+char2;
}


export function decryptByPlayfairCipher(matrix: Matrix, cipheredText: string) {
    let decipherText = '';
    for (var i = 0; i < cipheredText.length; i=i+2){
        let ele1: any = search(matrix, cipheredText[i]);
        let ele2: any = search(matrix, cipheredText[i+1]);
        if(ele1[0]==ele2[0]){
            decipherText = decipherText + decrypt_RowRule(matrix, ele1[0], ele1[1], ele2[0], ele2[1]);
        } else if (ele1[1]==ele2[1]){
            decipherText = decipherText + decrypt_ColumnRule(matrix, ele1[0], ele1[1], ele2[0], ele2[1]);
        } else {
            decipherText = decipherText + encrypt_RectangleRule(matrix, ele1[0], ele1[1], ele2[0], ele2[1]);
        }
    }
    return decipherText;
}


// let matrix = generateKeyTable(changeJToI(toLowerCase(removeSpaces(key))), alfabet);
// let preparedText = prepareText(changeJToI(toLowerCase(removeSpaces(text))));
// let cipheredText = encryptByPlayfairCipher(matrix, preparedText);
// let decryptedText = decryptByPlayfairCipher(matrix, cipheredText);
