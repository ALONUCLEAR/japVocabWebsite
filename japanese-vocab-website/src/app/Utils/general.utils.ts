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

/**All the numbers that start with vowels up to 100 */
const NUMBERS_THAT_START_WITH_VOWELS = [1, 8, 11, 18, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89]

export const calcAge = (today: Date, birth: Date): number => {
  const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000; // Average milliseconds in a year
  const msDiff = today.getTime() - birth.getTime();

  return Math.floor(msDiff / millisecondsPerYear);
};

export const getPrefix = (num: number): string => NUMBERS_THAT_START_WITH_VOWELS.includes(num) ? 'an' : 'a';

export const randInt = (min: number = 0, max: number = 10) => min + Math.floor(Math.random() * (max - min));

export const randStr = (len: number = 8): string => {
  let str = '';
  
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(97 + randInt(0, 25));
  }

  return str;
};