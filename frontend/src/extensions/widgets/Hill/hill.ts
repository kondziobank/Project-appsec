export type Matrix<T> = T[][];

export function key2d(key: string){
    key=key.toUpperCase();
    let keyMatrix = Array.from(Array(2), _ => Array(2).fill(0));
    for (var i = 0; i<2;i++){
        for (var j = 0; j<2; j++){
            keyMatrix[i][j] = key[i*2+j].charCodeAt(0) - 65;
        }
    }
    return keyMatrix;
}

export function checkKey2d(keyMatrix: Matrix<number>){
    var deter = keyMatrix[0][0] * keyMatrix[1][1] - keyMatrix[0][1] * keyMatrix[1][0];
    deter = modulo(deter);

    for (var i = 0; i<26;i++){
        var temp_inv = deter * i;
        if (temp_inv%26==1){
            return i;
        }
    }
    return -1;
}

export function validateKey(key: string){
    key = key.toUpperCase();
    if (!/^[a-zA-Z]{4}$/.test(key)){
        return false;
    }
    return checkKey2d(key2d(key)) != -1;
}

export function encrypt(word: string,key2d: Matrix<number>){
    word=word.toUpperCase();
    if (word.length%2 == 1){
        word = word + 'A';
    }
    var row = 2;
    var col = Math.ceil(word.length/2);
    let matrix = Array.from(Array(col), _ => Array(row).fill(0));
    var last_index=0;
    if(word.length > 0)
    {
        for (var i = 0; i<word.length;i++){
            matrix[Math.floor(i/2)][i%2]=word[i].charCodeAt(0) - 65;
            last_index = Math.floor(i/2);
        }
        if (word.length % 2 ==1)
        {
            matrix[last_index][1]=0;
        }
    }
    let encrypted_text = '';
    
    for (var i = 0; i<col;i++){
        var temp1 = matrix[i][0] * key2d[0][0] + matrix[i][1] * key2d[0][1];
        encrypted_text += String.fromCharCode(temp1%26+65);
        var temp2 = matrix[i][0] * key2d[1][0] + matrix[i][1] * key2d[1][1];
        encrypted_text += String.fromCharCode(temp2%26+65);
    }
    return encrypted_text;
}

export function decrypt(word: string,key2d: Matrix<number>){
    word=word.toUpperCase();
    var len_chk = 0;
    if (word.length%2 == 1){
        word = word + '0';
        len_chk = 1;
    }
    var row = 2;
    var col = Math.floor(word.length/2);
    let matrix = Array.from(Array(row), _ => Array(col).fill(0));
    var inr1 = 0;
    var inr2 = 0;
    for (var i = 0; i<word.length;i++){
        if (i%2==0){
            matrix[0][inr1] = word[i].charCodeAt(0) - 65
            inr1++;
        } 
        else {
            matrix[1][inr2] = word[i].charCodeAt(0) - 65
            inr2++;
        }
    }
    var mul_inv = checkKey2d(key2d);
    var temp_int = key2d[1][1]
    key2d[1][1] = key2d[0][0];
    key2d[0][0] = temp_int;
    key2d[0][1] *= -1;
    key2d[1][0] *= -1;

    key2d[0][1] = modulo(key2d[0][1]);
    key2d[1][0] = modulo(key2d[1][0]);

    for (var i = 0; i<2;i++){
        for (var j = 0; j<2;j++){
            key2d[i][j] *= mul_inv;
            key2d[i][j] = modulo(key2d[i][j]);
        }
    }


    let decrypted_text = '';
    if(len_chk == 0){
        for (var i = 0; i<col;i++){
            var temp1 = matrix[0][i] * key2d[0][0] + matrix[1][i] * key2d[0][1];
            decrypted_text += String.fromCharCode(temp1%26+65);
            var temp2 = matrix[0][i] * key2d[1][0] + matrix[1][i] * key2d[1][1];
            decrypted_text += String.fromCharCode(temp2%26+65);
        }
    } 
    else {
        for (var i = 0; i<col-1;i++){
            var temp1 = matrix[0][i] * key2d[0][0] + matrix[1][i] * key2d[0][1];
            decrypted_text += String.fromCharCode(temp1%26+65);
            var temp2 = matrix[0][i] * key2d[1][0] + matrix[1][i] * key2d[1][1];
            decrypted_text += String.fromCharCode(temp2%26+65);
        }
    }
    return decrypted_text;
}

function modulo(value: number){
    if (value >= 0){
        value = value % 26;
    } else {
        while (value < 0){
            value = value + 26;
        }
    }
    return value;
}