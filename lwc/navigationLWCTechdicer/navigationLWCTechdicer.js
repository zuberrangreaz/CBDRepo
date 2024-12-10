import { LightningElement, wire } from 'lwc';
import retrieveAccounts from '@salesforce/apex/DataController.retrieveAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
];
 
const columns = [
    { label: 'Id', fieldName: 'Id' }, 
    { label: 'Name', fieldName: 'Name', sortable: true  },
    { label: 'Type', fieldName: 'Type', sortable: true  },
    { label: 'BillingCountry', fieldName: 'BillingCountry', sortable: true  },  
    {   label: 'Action',
        type: 'action',
        initialWidth:'50px',
        typeAttributes: { rowActions: actions },
    },     
];
 
export default class NavigationLWCTechdicer extends NavigationMixin(LightningElement)  {
    columns = columns;
    items;
    error;
 
    @wire(retrieveAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.items = data;
            this.columns = columns;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.items = undefined;
            this.showToast(this.error, 'Error', 'Error'); //show toast for error
        }
    }
 
    handleRowAction( event ) {
 
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch ( actionName ) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Account',
                        actionName: 'edit'
                    }
                });
                break;
            default:
        }
    }
 
    showToast(message, variant, title) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
 
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Account',
                        actionName: 'edit'
                    }
                });
                break;
            default:
        }
 
    }
}