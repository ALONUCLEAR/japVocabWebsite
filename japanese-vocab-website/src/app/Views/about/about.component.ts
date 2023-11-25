import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { StorageService } from 'src/app/Services/storage.service';
import { error, success } from 'src/app/Utils/alert.utils';
import { calcAge, getPrefix } from 'src/app/Utils/general.utils';
import { environment as env } from 'src/environments/environment';

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
export class AboutComponent implements OnInit, AfterViewInit {
  myAge: number = 0;
  prefix: string = 'a';
  japVocabAge: number = 0;

  contactForm: FormGroup<ContactForm> = new FormGroup({
    title: new FormControl<string | null>("", Validators.required),
    email: new FormControl<string | null>("", Validators.email),
    content: new FormControl<string | null>("", Validators.required)
  })
  isSending: boolean = false;

  constructor(private readonly storageService: StorageService) {}

  ngOnInit(): void {
    this.myAge = calcAge(new Date(), MY_BDAY);
    this.prefix = getPrefix(this.myAge);
    this.japVocabAge = calcAge(new Date(), JAP_VOCAB_BDAY);
    this.isSending = false;
  }

  ngAfterViewInit(): void {
    const START_SECTION_KEY = 'startSection';
    const startSection: string = this.storageService.getStorage(START_SECTION_KEY) ?? '';
    
    if(startSection.length) {
      setTimeout(() => {
        this.scrollToElement(startSection);
        this.storageService.removeItem(START_SECTION_KEY);
      }, 200);
    }
  }

  scrollToElement(id: string): void {
    const targetElement = document.getElementById(id);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async submitContactMail(): Promise<void> {
    const { title: titleControl, email: emailControl, content: contentControl} = this.contactForm.controls;
    const controls = [titleControl, emailControl, contentControl];

    if (controls.some(({ valid }) => !valid)) {
      error("At least one of the inputs you've entered is invalid");
      return;
    }

    this.isSending = true;

    try {
      const [title, email, content] = controls.map(({ value }) => value);
      const mailMessage = `This mail was sent at ${new Date()} (even though it might have taken a while thanks to the service).
${!email?.length ? '' : `\nIt was sent from ${email}.\n`}\n${content}`;

      const axiosPromise = axios(
        `${env.emailServiceRoute}/to/${env.myEmail}/titled/${title}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({ text: mailMessage }),
          timeout: 1800000,
        }
      );

      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve('Timeout was over'), 3000)
      );

      const res = await Promise.race([axiosPromise, timeoutPromise]);
      console.log(
        `(${new Date().toLocaleString('he')}) Race finished with result`,
        res
      );

      if (!res) {
        throw Error('No result was recieved');
      }

      setTimeout(() => {
        success(
          'Message Sent Successfully',
          "If you require a response, i'll try to do it asap"
        );
        this.isSending = false;
      }, 3000);
    } catch (err) {
      console.error(err);
      error(
        'There was an error sending the message.',
        'Please try again later, or contact me on itch.io'
      );
      this.isSending = false;
    }
  }
}