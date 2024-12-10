import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createProjectPipeline from '@salesforce/apex/ProjectPipelineController.createProjectPipeline';

export default class ProjectPipline extends LightningElement {
    @track fields = false;
    @track salesforceOrgId = [];
    @track projectId = '';
    @track projectPiplineName = '';
    @track showSpinner = false;
    @track piplineOrg = [];
    @track boxNumber = [];
    @track imageURL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBByCzoKIlTG3zvmHHr9v7VIgpnJG8N0tIEiaIatsf7bo3ve2nTgCF5vTCq8oWATYSZQ&usqp=CAU';
    @track buttonShowHide = false;
    @track newProjectCreat = false;
    @track showButton = false;

    handleMouseOver() {
        this.showButton = true;
    }

    handleMouseLeave() {
        this.showButton = false;
    }

    handleButtonClick() {
        this.fields = true;

         if (this.boxNumber.length < 6) {

        const newBox = { id: this.boxNumber.length + 1, isShowButtan: false };
        this.boxNumber = [...this.boxNumber, newBox];

        if (this.boxNumber.length === 1) {
            this.boxNumber[0].isShowButtan = true;
        }

         } else {
              console.warn('');
              this.showToast('Error', 'Cannot add more items. The array has reached its maximum length. ', 'error');
          }

    }

    handleDeleteAction(event) {
        const boxId = parseInt(event.currentTarget.dataset.id, 10);
         console.log('Delete button clicked for: kkk', boxId);
        this.boxNumber.splice(this.boxNumber.findIndex(row => row.key === boxId), 1);
    }

    handleNameChange(event) {
        this.projectPiplineName = event.target.value;
    }

    handleChange(event) {
        const selectedRecordId = event.detail.recordId;
        if (!this.salesforceOrgId.includes(selectedRecordId)) {
            this.salesforceOrgId.push(selectedRecordId);
        }
    }

    handleLookupSelection(event) {
        if (event.detail.selectedRecord != undefined) {
            this.projectId = event.detail.selectedRecord.Id;      
        }
    }

    handleClick() {
        console.log('this.projectId', this.projectId);
        if (this.salesforceOrgId.length === 0) {
            this.showToast('Error', 'No Salesforce Org IDs selected', 'error');
            return;
        }

        createProjectPipeline({
            projectName: this.projectPiplineName,
            salesforceOrgIds: this.salesforceOrgId,
            ProjectId: this.projectId
        })
            .then((result) => {
                console.log('result12 -->', result);
                this.showToast('Success', result, 'success');
                this.salesforceOrgId = [];
                this.projectPipelineName = '';
                this.projectId = '';
            })
            .catch((error) => {
                this.showToast('Error', 'Error creating projects: ' + error.body.message, 'error');
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

    callParent(event) {
        console.log('bbbb');
        let paramData = { newProjectCreat: this.newProjectCreat };
        let ev = new CustomEvent('childmethod',
            { detail: paramData }
        );
        this.dispatchEvent(ev);
    }
}