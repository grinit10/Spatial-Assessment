import { Component, OnInit } from '@angular/core';
import { LocationServiceService } from './services/location-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from './models/user-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  latitude = -28.68352;
  longitude = -147.20785;
  mapType = 'satellite';
  localStorageNameField = 'Name';
  localStorageEmailField = 'Email';
  localStorageLatitudeField = 'Latitude';
  localStorageLongitudeField = 'Longitude';
  localStorageDateOfBirthField = 'DateOfBirth';
  profileForm: FormGroup;
  user: User;


  ngOnInit() {
    this.locationService.getPosition().then(pos => {
      console.log(`Positon: ${pos.lng} ${pos.lat}`);
      this.latitude = pos.lat;
      this.longitude = pos.lng;
    });
  }

  constructor(
    private fb: FormBuilder,
    private locationService: LocationServiceService) {
      this.user = {
        Name: localStorage.getItem(this.localStorageNameField),
        DateOfBirth: new Date(localStorage.getItem(this.localStorageDateOfBirthField)),
        Email: localStorage.getItem(this.localStorageEmailField),
        Address: {
          Latitude: parseFloat(localStorage.getItem(this.localStorageLatitudeField)),
          Longitude: parseFloat(localStorage.getItem(this.localStorageLongitudeField)),
        }
      };

      this.profileForm = fb.group({
        Id: [this.user.Id],
        Name: [this.user.Name, Validators.required],
        Email: [this.user.Email, Validators.required],
        DateOfBirth: [this.user.DateOfBirth, Validators.required],
        Address: this.fb.group({
          Latitude: [ this.user.Address.Latitude == null ? this.user.Address.Latitude : this.latitude, Validators.required],
          Longitude: [this.user.Address.Longitude  == null ? this.user.Address.Longitude : this.longitude, Validators.required]
        })
      });
  }

  onFormSubmit = (formData: User) => {
    localStorage.setItem(this.localStorageNameField, formData.Name);
    localStorage.setItem(this.localStorageDateOfBirthField, formData.DateOfBirth.toString());
    localStorage.setItem(this.localStorageEmailField, formData.Email);
    localStorage.setItem(this.localStorageLatitudeField, formData.Address.Latitude.toString());
    localStorage.setItem(this.localStorageLongitudeField, formData.Address.Longitude.toString());
  }
}
