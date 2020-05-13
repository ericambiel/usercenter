import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  templateUrl: 'inventory.component.html',
  styleUrls: ['inventory.component.scss']
})

export class InventoryComponent implements OnInit {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder){
    this.contactForm = fb.group({
      designation: '11',
      patrimonyNumberFrom: '1',
      patrimonyNumberTo: '1',
      subNumberFrom: '1',
      subNumberTo: '1',
      inventoryNumberFrom: '1',
      inventoryNumberTo: '1',
      costCenterFrom: '1',
      costCenterTo: '1',
      incorporationDateFrom: new Date('01-25-1990'),
      incorporationDateTo: new Date('02-15-2000')
    });
  }

  ngOnInit(): void {
  }

}
