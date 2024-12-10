import { LightningElement, track, wire } from 'lwc';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import TYPE_FIELD from '@salesforce/schema/Account.Type';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
const options = [
                    {'label':'India','value':'India'},
                    {'label':'USA','value':'USA'},
                    {'label':'China','value':'China'},
                    {'label':'Rusia','value':'Rusia'}
                ];
 
export default class MultiSelectPickListParent extends LightningElement {
    @track selectedValue = 'Customer - Direct';//selected values
    @track selectedValueList = ['Customer - Direct'];//selected values
    @track options; //= options;
    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    objectInfo;
 
    //fetch picklist options
    @wire(getPicklistValues, {
        recordTypeId: "$objectInfo.data.defaultRecordTypeId",
        fieldApiName: TYPE_FIELD
    })
    wirePickList({ error, data }) {
        if (data) {
            this.options = data.values;
        } else if (error) {
            console.log(error);
        }
    }
     
    //for single select picklist
    handleSelectOption(event){
        console.log(event.detail);
        this.selectedValue = event.detail;
    }
 
    //for multiselect picklist
    handleSelectOptionList(event){
        console.log(event.detail);
        this.selectedValueList = event.detail;
        console.log(this.selectedValueList);
    }
}