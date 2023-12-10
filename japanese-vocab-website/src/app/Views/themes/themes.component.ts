import { Component } from '@angular/core';

type Proficiency = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
interface Theme {
  dayNum: number,
  title: string
}

const N5Themes: Theme[] = [
  { title: "colors(only part of the vocab for this day)", dayNum: 1 },
  { title: "family", dayNum: 2 },
  { title: "counters", dayNum: 9 },
  { title: "counters for days/days of the month", dayNum: 10 },
  { title: "a few more counters and days of the month", dayNum: 11 },
];

const N4Themes: Theme[] = [
  { title: "Words related to the suffixes", dayNum: 54 },
  { title: "Suffixes", dayNum: 55 }
];

const N3Themes: Theme[] = [
  { title: "Love & Emptiness", dayNum: 64 },
  { title: "Food", dayNum: 134 },
  { title: "Days of the week", dayNum: 174 }
];

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.less']
})
export class ThemesComponent {
  classes: Map<Proficiency, Theme[]> = new Map();
  proficiencyRanges = {
    N5: "1-19",
    N4: "20-63",
    N3: "64-175",
    N2: "?",
    N1: "?"
  }
  availableProficiencies: Proficiency[] = ['N5', 'N4', 'N3'];

  constructor() {
    this.classes.set('N5', N5Themes);
    this.classes.set('N4', N4Themes);
    this.classes.set('N3', N3Themes);
  }
}