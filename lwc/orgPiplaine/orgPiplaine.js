import { LightningElement, track, api } from 'lwc';
import deletePipelineRecord from '@salesforce/apex/GetSalesforeceOrg.deletePipelineRecord';
import updateProject from '@salesforce/apex/GetSalesforeceOrg.updateProject';
import orderUpdate from '@salesforce/apex/GetSalesforeceOrg.orderUpdate';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class OrgPiplaine extends LightningElement {

    @track isConfiguring = false;
    @api pipelineList = [];
    @api projactId;
    showSpinner = false;
    @track imageURL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBByCzoKIlTG3zvmHHr9v7VIgpnJG8N0tIEiaIatsf7bo3ve2nTgCF5vTCq8oWATYSZQ&usqp=CAU';
    dragSource;
    draggingClass = 'dragging';
    @track boxNumber = [];
    @track boxClike = false;
    @track salesforceOrgId = [];
    @track dregaAndDrop = false;

    handleButtonClick() {
        this.boxClike = true;

        let alboxlenght = this.boxNumber.length + this.pipelineList.length;

        if (alboxlenght < 7) {
            this.boxNumber.push(this.boxNumber.length + 1);  // Add a new box
        } else {
            console.warn('');
            this.showToast('Error', 'Cannot add more items. The array has reached its maximum length. ', 'error');
        }

    }

    reorderPipelineList() {
        // Example: Sort the list by 'order' property
        this.pipelineList.sort((a, b) => a.order - b.order);
    }

    handleDeletelokupBox(event) {
        const boxId = parseInt(event.currentTarget.dataset.id, 10);
        console.log('Delete button clicked for: kkk', boxId);
        this.boxNumber.splice(this.boxNumber.findIndex(row => row.key === boxId), 1);
    }

    handleChange(event) {
        const selectedRecordId = event.detail.recordId;
        if (!this.salesforceOrgId.includes(selectedRecordId)) {
            this.salesforceOrgId.push(selectedRecordId);
        }
    }

    callParent(event) {
        console.log('callParent orgPiplaine');
        let paramData = { isConfiguring: this.isConfiguring };
        let ev = new CustomEvent('childmethod',
            { detail: paramData }
        );
        this.dispatchEvent(ev);
    }

    handleSave(event) {

        console.log('pipelineList pipelineList --->', JSON.stringify(this.pipelineList));

        let orderNumber = this.pipelineList.length;

        if (this.salesforceOrgId.length != 0) {
            this.showSpinner = true;
            updateProject({ recordId: this.projactId, salesforceOrgIds: this.salesforceOrgId, orderNumber: orderNumber })
                .then(() => {
                    this.showSpinner = false;
                    console.log('Record update successfully.');
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Projact update successfully.',
                            variant: 'success'
                        })
                    );
                })
                .catch(error => {
                    console.error('Error update record:', error);
                    this.showSpinner = false;
                    // Show error toast message
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error update record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
        }

    }

    handleDeleteAction(event) {
        this.showSpinner = true;
        const itemId = event.currentTarget.dataset.id;
        console.log('Deleting item with ID:', itemId);

        deletePipelineRecord({ recordId: itemId })
            .then(() => {
                this.showSpinner = false;
                this.pipelineList = this.pipelineList.filter(item => item.Id !== itemId);
                console.log('Record deleted successfully.');
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted successfully.',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                console.error('Error deleting record:', error);
                this.showSpinner = false;
                // Show error toast message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    drag(event) {
        this.dragSource = event.target;
        console.log('eee', event.target.innerHTML);
        evt.target.classList.add(this.draggingClass);
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('text/html', this.dragSource.innerHTML);
    }

    DragOver(event) {
        event.preventDefault();
    }

    Drop(event) {
        event.stopPropagation();
        if (this.dragSource !== event.target) {
            this.dregaAndDrop = true;
            console.log('dregaAndDraaao ddss--->sss', this.dregaAndDrop);
            let dragVal = this.dragSource.innerHTML;
            let dropVal = event.target.innerHTML;

            let dragorder = this.dragSource.dataset.order;
            let droporder = event.target.dataset.order;

            let dragId = this.dragSource.dataset.id;
            let dropId = event.target.dataset.id;

            this.handleOrderUpdateAction(dragId, dropId, dragorder, droporder);


            this.dragSource.innerHTML = dropVal;
            event.target.innerHTML = dragVal;


        }
        event.preventDefault();
    }

    handleOrderUpdateAction(dragId, dropId, dragOrder, dropOrder) {
        this.showSpinner = true;
        orderUpdate({ dragId: dragId, dropId: dropId, dragOrder: dragOrder, dropOrder: dropOrder })
            .then((res) => {
                console.log('res  --->', res);
                this.showSpinner = false;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Order Update successfully.',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                console.error('Error Order Update record:', error);
                this.showSpinner = false;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error Update record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }

}