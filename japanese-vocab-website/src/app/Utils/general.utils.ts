import { toWords } from "number-to-words";

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

const VOWELS = [...'aiueo'];

export const calcAge = (today: Date, birth: Date): number => {
  const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000; // Average milliseconds in a year
  const msDiff = today.getTime() - birth.getTime();

  return Math.floor(msDiff / millisecondsPerYear);
};

export const getPrefix = (num: number): string => VOWELS.includes(toWords(num)[0]) ? 'an' : 'a';