import { Component, OnInit } from '@angular/core';
import { toWords } from 'number-to-words';

const MY_BDAY = new Date(2004, 6, 11),
  JAP_VOCAB_BDAY = new Date(2022, 6, 31);
const VOWELS = [...'aiueo'];

const calcAge = (today: Date, birth: Date = MY_BDAY): number => {
  const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000; // Average milliseconds in a year
  const msDiff = today.getTime() - birth.getTime();

  return Math.floor(msDiff / millisecondsPerYear);
};

const getPrefix = (num: number): string =>
  VOWELS.includes(toWords(num)[0]) ? 'an' : 'a';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less'],
})
export class AboutComponent implements OnInit {
  myAge: number = 0;
  prefix: string = 'a';
  japVocabAge: number = 0;

  ngOnInit(): void {
    this.myAge = calcAge(new Date());
    this.prefix = getPrefix(this.myAge);
    this.japVocabAge = calcAge(new Date(), JAP_VOCAB_BDAY);
  }

  scrollToElement(id: string): void {
    const targetElement = document.getElementById(id);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
