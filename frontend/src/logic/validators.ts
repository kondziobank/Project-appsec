import isStrongPassword from 'validator/lib/isStrongPassword'

// Copied from backend
// Please, remember about updating policy info
const passwordPolicy = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
};


export function validatePasswordComplexity(password: string) {
  return isStrongPassword(password, passwordPolicy)
}

export function generatePasswordComplexityPolicyInfo(t: any) {
    // Update language labels (number -> numbers, znaki -> znaków etc.)
    return t('validate_password.heading') + [
        `${t('validate_password.at_least')} ${passwordPolicy.minLength} ${t('validate_password.characters')}`,
        `${t('validate_password.at_least')} ${passwordPolicy.minUppercase} ${t('validate_password.uppercase_letter')}`,
        `${t('validate_password.at_least')} ${passwordPolicy.minUppercase} ${t('validate_password.lowercase_letter')}`,
        `${t('validate_password.at_least')} ${passwordPolicy.minNumbers} ${t('validate_password.numbers')}`,
        `${t('validate_password.at_least')} ${passwordPolicy.minSymbols} ${t('validate_password.symbols')}`
    ].join(', ');
}
