function changeLetter(letter: any, key: number){
    var charCode = letter.charCodeAt();
    while(key < 0){
        key += 26;
    }
    key = key%26;
    if(letter.charCodeAt() < 97){
        return String.fromCharCode(
            ((charCode + key) <= 90) ? charCode + key
                                    : (charCode + key) % 90 + 64
           );
    } else {
        return String.fromCharCode(
            ((charCode + key) <= 122) ? charCode + key
                                    : (charCode + key) % 122 + 96
           );
    }
}

export function ROT13(message: string){
    return message.replace(/[a-z]/gi, letter => changeLetter(letter, 13));
}
