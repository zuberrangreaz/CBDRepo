import { LightningElement, track } from 'lwc';
import customSpinner from '@salesforce/resourceUrl/MyImage';

export default class CustomSpinner extends LightningElement {
    @track isLoading = true;
    spinnerUrl = customSpinner;
}