/**A function to convert big integers(in string form) to their number counterpart.
 * Since big integers are bigger than numbers can be(otherwise we would've used numbers),
 * This function gets a dotPlacement variable, whic is the power of 10 that we divide by,
 * in order to make the bigInt small enough
 * @default
 * By default, the dot placement is 3, meaning the big int is divided by 1000
 */
export function bigIntStrToNumber(bigIntStr: string, dotPlacement: number = 3): number {
    //Since big integers are integers, we assume there's no dot already present

    const slicingPoint = bigIntStr.length - dotPlacement;
    const smallerString = bigIntStr.substring(0, slicingPoint) + '.' + bigIntStr.substring(slicingPoint);
    
    return Number(smallerString);
}