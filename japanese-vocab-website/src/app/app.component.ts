import { Component, OnInit } from '@angular/core';
import { RecordsService } from './Services/records.service';
import { RecordsStore } from './Store/records/records.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly recordsService: RecordsService,
    private readonly recordsStore: RecordsStore
  ) {}

  async ngOnInit(): Promise<void> {
    this.recordsStore.add(await this.recordsService.getAllRecords());
  }
}