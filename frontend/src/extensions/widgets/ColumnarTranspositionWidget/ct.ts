export type Matrix<T> = T[][];

export function makeMatrix(key: string, word: string){
    let matrix: Matrix<string>  = [];
    for (var i = 0; i < key.length; i++){
        matrix.push([]);
    }
    for (var i = 0; i < word.length; i++){
        matrix[i%key.length].push(word[i]);
    }
    for (var i = 1; i < key.length; i++){
        if (matrix[0].length > matrix[i].length){
            matrix[i].push(' ');
        }
    }
    return matrix;
}

export function validateKey(key: string){
    if (!/^\d+$/.test(key)){
        return false;
    }
    if(key.length !== (new Set(key)).size){
        return false;
    }
    if(Math.max(...Array.from(key).map(e => parseInt(e))) !== key.length - 1){
        return false;
    }
    return true;
}

function readFromDecryptedMatrix(revKey: Matrix<number>, matrix: Matrix<string>){
    let str = '';
    for (var i = 0; i < matrix[0].length; i++){
        for (var j = 0; j < revKey.length; j++){
            str += matrix[revKey[j][1]][i];
        }
    }
    return str;
}

export function columnarTranspositionMatrix(revKey: Matrix<number>, matrix: Matrix<string>){

    const result: Matrix<string> = [];
    for (var i = 0; i < revKey.length; i++){
        result.push(JSON.parse(JSON.stringify(matrix[revKey[i][1]])));
    }
    return result;
}

function sortFunction(a: number[], b: number[]) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

export function revKey(key: string){
    let revKey = [];
    for (var i = 0; i < key.length; i++){
        revKey.push([parseInt(key[i]), i]);
    }
    return revKey.sort(sortFunction)
}

export function getRevKey(keys: Matrix<number>){
    return keys.map((row) => row[1]).join('')
}

export function readFromMatrix(matrix: Matrix<string>){
    let str = '';
    for (var i = 0; i < matrix[0].length; i++){
        for (var j = 0; j < matrix.length; j++){
            str += matrix[j][i];
        }
    }
    return str;
}
