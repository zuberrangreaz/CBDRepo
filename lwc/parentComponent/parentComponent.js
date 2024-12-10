import { LightningElement, track } from 'lwc';

export default class ParentComponent extends LightningElement {
    @track showSpinner = false;

    handleShowSpinner() {
        this.showSpinner = true;
        setTimeout(() => {
            this.showSpinner = false;
        }, 3000);
    }

    handleHideSpinner() {
        this.showSpinner = false;
    }
}