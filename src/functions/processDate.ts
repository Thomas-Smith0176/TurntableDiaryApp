export function processDate (date: string) {
    if(date.length === 4 ) return date
    else {
        return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`
    }
}