import { LightningElement, api, track } from 'lwc';
import fetchRecords from '@salesforce/apex/MultiObjectLookupController.fetchRecords';

export default class MultiObjectLookup extends LightningElement {
    @api objectList = [];
    @api value = '';
    @api recordCount = 5;
    @api label = '';
    @api placeholder = 'Search..78';

    @track searchString = '';
    @track selectedObject = {};
    @track selectedRecord = {};
    @track recordsList = [];
    @track showObjectList = false;
    @track message = '';
    @track showSpinner = false;
    @track openDrop = false;

    connectedCallback() {
        this.objectList = [
            { label: 'Contact', APIName: 'contact', fieldName: 'Name', iconName: 'standard:contact' },
            { label: 'Lead', APIName: 'lead', fieldName: 'Name', iconName: 'standard:lead' }
        ];
        this.selectedObject = this.objectList[0];
    }

    get dropdownStyle() {
        return `max-height: ${8 + this.recordCount * 40}px`;
    }

    get isMessageEmpty() {
        return this.message === '';
    }

    showObjects() {
        this.showObjectList = true;
    }

    selectObject(event) {
        const selectedId = event.currentTarget.dataset.id;
        const selectedObj = this.objectList.find(obj => obj.APIName === selectedId);
        if (selectedObj) {
            this.selectedObject = selectedObj;
            this.searchString = '';
            this.showObjectList = false;
        }
    }

    searchRecords(event) {
        this.searchString = event.target.value;
        if (this.searchString) {
            this.searchRecordsHelper();
        } else {
            this.closeDropdown();
        }
    }

    searchRecordsHelper() {
        this.showSpinner = true;
        this.message = '';
        this.recordsList = [];

        fetchRecords({
            objectName: this.selectedObject.APIName,
            filterField: this.selectedObject.fieldName,
            searchString: this.searchString
        })
            .then(result => {
                if (result.length > 0) {
                    this.recordsList = result;
                    console.log('result--->', result);
                } else {
                    this.message = 'No Records Found';
                    console.log('message--->', this.message);
                }
                this.openDropdown();
            })
            .catch(error => {
                this.message = error.body?.message || 'Error fetching records';
                this.openDropdown();
            })
            .finally(() => {
                this.showSpinner = false;
            });
    }

    selectItem(event) {
        const selectedId = event.currentTarget.dataset.id;
        const selectedItem = this.recordsList.find(rec => rec.value === selectedId);
        if (selectedItem) {
            this.selectedRecord = selectedItem;
            this.value = selectedItem.value;
            this.closeDropdown();
        }
    }

    handleRemove() {
        this.selectedRecord = {};
        this.value = '';
        this.searchString = '';
       // this.template.querySelector('[data-id="combobox-id-1"]').focus();
    }

    blurRecordList() {
        this.closeDropdown();
    }

    blurObjectList() {
        this.closeObjectList();
    }

    openDropdown() {
        this.openDrop = true;
        this.template.querySelector('.slds-dropdown-trigger').classList.add('slds-is-open');
    }

    closeDropdown() {
        this.template.querySelector('.slds-dropdown-trigger').classList.remove('slds-is-open');
    }

    closeObjectList() {
        this.showObjectList = false;
    }
}