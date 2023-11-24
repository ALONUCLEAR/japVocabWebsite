import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { error, info } from 'src/app/Utils/alert.utils';
import { calcAge, getPrefix } from 'src/app/Utils/general.utils';

const MY_BDAY = new Date(2004, 6, 11), JAP_VOCAB_BDAY = new Date(2022, 6, 31);

interface ContactForm {
  title: FormControl<string | null>,
  email: FormControl<string | null>,
  content: FormControl<string | null>
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less'],
})
export class AboutComponent implements OnInit {
  myAge: number = 0;
  prefix: string = 'a';
  japVocabAge: number = 0;

  contactForm: FormGroup<ContactForm> = new FormGroup({
    title: new FormControl<string | null>("", Validators.required),
    email: new FormControl<string | null>("", Validators.email),
    content: new FormControl<string | null>("", Validators.required)
  })

  ngOnInit(): void {
    this.myAge = calcAge(new Date(), MY_BDAY);
    this.prefix = getPrefix(this.myAge);
    this.japVocabAge = calcAge(new Date(), JAP_VOCAB_BDAY);
  }

  scrollToElement(id: string): void {
    const targetElement = document.getElementById(id);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  submitContactMail(): void {
    const { title: titleControl, email: emailControl, content: contentControl} = this.contactForm.controls;
    const controls = [titleControl, emailControl, contentControl];
    
    if (controls.some(({valid}) => !valid)) {
      error("At least one of the inputs you've entered is invalid");
      return;
    }

    const [title, email, content] = controls.map(({value}) => value);
    const mailMessage = `
      This mail was sent at ${new Date()}(even though it might have taken a while thanks to the service).\n
      ${!email?.length ? '' : `It was sent from ${email}.\n`}
      \n\n\n
      ${content}
    `;

    info(title!, mailMessage);
    console.log({title, email, content});
  }
}
