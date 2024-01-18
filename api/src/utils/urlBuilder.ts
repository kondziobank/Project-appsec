export default function url(base: string, queryParams: any) {
    const queryParamsString = Object.entries(queryParams)
        .map(([key, value]) => [key, encodeURIComponent(value as any)].join('='))
        .join('&')
    
    return `${base}?${queryParamsString}`
}

export const recordParam = ':prefix([~@]):record'
