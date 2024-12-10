import { LightningElement, api, wire, track } from 'lwc';
import searchLookupData from '@salesforce/apex/CustomLookupCtrl.searchLookupData';
import searchDefaultRecord from '@salesforce/apex/CustomLookupCtrl.searchDefaultRecord';

export default class CustomLookup extends LightningElement {
    // public properties with initial default values 
    @api label = 'label';
    @api placeholder = 'search...';
    @api iconName = 'standard:contact';
    @api sObjectApiName = 'Contact';
    @api defaultRecordId = '';
    @api defaultKey = '';
    @api required;
    @api objectList = [];
    @track selectedObject = {};
    // private properties 
    lstResult = []; // to store list of returned records   
    hasRecords = true;
    searchKey = ''; // to store input field value    
    isSearchLoading = false; // to control loading spinner  
    delayTimeout;
    isValueSelected;
    selectedRecord = {}; // to store selected lookup record in object formate 
    // initial function to populate default selected lookup record if defaultRecordId provided  
    connectedCallback() {
        if (this.defaultRecordId != '') {
            searchDefaultRecord({ recordId: this.defaultRecordId, 'sObjectApiName': this.sObjectApiName })
                .then((result) => {
                    if (result != null) {
                        this.selectedRecord = result;

                        const oEvent = new CustomEvent('lookupupdate',
                            {
                                'detail': { selectedRecord: this.selectedRecord, dataKey: this.defaultKey }
                            }
                        );
                        this.dispatchEvent(oEvent);

                        this.handelSelectRecordHelper(); // helper function to show/hide lookup result container on UI
                    }
                })
                .catch((error) => {
                    this.error = error;
                    this.selectedRecord = {};
                });
        }

        this.objectList = [
            { label: 'Contact', APIName: 'contact', fieldName: 'name', iconName: 'standard:contact' },
            { label: 'Lead', APIName: 'lead', fieldName: 'name', iconName: 'standard:lead' }
        ];
        this.selectedObject = this.objectList[0];
    }
    // wire function property to fetch search record based on user input
    @wire(searchLookupData, { searchKey: '$searchKey', sObjectApiName: '$sObjectApiName' })
    searchResult(value) {
        const { data, error } = value; // destructure the provisioned value
        this.isSearchLoading = false;
        if (data) {
            this.hasRecords = data.length == 0 ? false : true;
            this.lstResult = JSON.parse(JSON.stringify(data));
        }
        else if (error) {
            console.log('(error---> ' + JSON.stringify(error));
        }
    };

    // update searchKey property on input field change  
    handleKeyChange(event) {
        // Do not update the reactive property as long as this function is
        this.isSearchLoading = true;
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, 300);
    }
    // method to toggle lookup result section on UI 
    toggleResult(event) {
        const lookupInputContainer = this.template.querySelector('.lookupInputContainer');
        const clsList = lookupInputContainer.classList;
        const whichEvent = event.target.getAttribute('data-source');
        switch (whichEvent) {
            case 'searchInputField':
                clsList.add('slds-is-open');
                break;
            case 'lookupContainer':
                clsList.remove('slds-is-open');
                break;
        }
    }
    // method to clear selected lookup record  
    @api
    handleRemove() {
        this.searchKey = '';
        this.selectedRecord = {};
        this.lookupUpdateParenthandler(undefined); // update value on parent component as well from helper function
        this.isValueSelected = false;
    }
    // update selected record from search result 
    handelSelectedRecord(event) {
        var objId = event.target.getAttribute('data-recid'); // get selected record Id 
        this.selectedRecord = this.lstResult.find(data => data.Id === objId); // find selected record from list 
        this.lookupUpdateParenthandler(this.selectedRecord); // update value on parent component
        this.handelSelectRecordHelper(); // helper function to show/hide lookup result container on UI
    }
    //handle select record
    handelSelectRecordHelper() {
        this.template.querySelector('.lookupInputContainer').classList.remove('slds-is-open');
        this.isValueSelected = true;
    }
    // send selected lookup record to parent component using custom event
    lookupUpdateParenthandler(value) {
        console.log(this.defaultKey);
        const oEvent = new CustomEvent('lookupupdate',
            {
                'detail': { selectedRecord: value, dataKey: this.defaultKey }
            }
        );
        this.dispatchEvent(oEvent);
    }

    @api handleCheckValidation() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.fieldvalidate');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });

        console.log(isValid);
        return isValid;
    }
}