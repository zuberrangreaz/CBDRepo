import { LightningElement, wire, track } from 'lwc';
import fetchProject from '@salesforce/apex/GetSalesforeceOrg.fetchProject';
import fetchpipeline from '@salesforce/apex/GetSalesforeceOrg.fetchpipeline';
import fetchpipeline2 from '@salesforce/apex/GetSalesforeceOrg.fetchpipeline2';
export default class RoleTypeComp extends LightningElement {

    @track data;
    @track data1 = [];
    @track error;
    @track imageURL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBByCzoKIlTG3zvmHHr9v7VIgpnJG8N0tIEiaIatsf7bo3ve2nTgCF5vTCq8oWATYSZQ&usqp=CAU';
    @track imageURL1 = 'https://cdn.iconscout.com/icon/premium/png-512-thumb/merge-44-1181522.png?f=webp&w=256';
    @track isConfiguring = false;
    @track newProjectCreat = false;
    @track Project;
    @track TypeOptions;
    @track pipelineList;
    @track namedisplay = true;
    showSpinner = false;
    recoredId;
    projactId;
    @track pipelineOrder = [];
    @track configMessage = '';
    @track draggedItem;
    dragSource;
    draggingClass = 'dragging';

    handleDeleteAction(event) {
        const boxId = parseInt(event.currentTarget.dataset.id, 10);
        // Your delete action logic here
        console.log('Delete button clicked for: 155', boxId);
        console.log('firstPipelineName5', this.firstPipelineName);
        this.firstPipelineName.splice(this.firstPipelineName.findIndex(row => row.key === boxId), 1);
    }

    @wire(fetchProject)
    wiredSalesforceOrg({ error, data }) {
        if (data) {
            try {
                this.Project = data;
                let options = [];
                console.log('data[0].Id', data[0].Id);
                //this.projactId = data[0].Id;
                for (var key in data) {
                    // Here key will have index of list of records starting from 0,1,2,....
                    options.push({ label: data[key].Name, value: data[key].Id });

                    // Here Name and Id are fields from sObject list.
                }
                this.TypeOptions = options;

            } catch (error) {
                console.error('check error here', error);
            }
        } else if (error) {
            console.error('check error here', error);
        }
    }

    handleLoad() {
        this.showSpinner = true;
        console.log('zzz1');
        fetchpipeline({ projactId: this.projactId })
            .then(result => {
                this.showSpinner = false;
                console.log('result 11 ', JSON.stringify(result));
                this.pipelineList = result;
                console.log('pipelineList', this.pipelineList);
                this.pipelineOrder = this.pipelineList.map(item => item.Id);
                console.log('pipelineOrder', this.pipelineOrder);

            })
            .catch(error => {
                this.showSpinner = false;
                console.log(error);
                this.error = error;
            });
            this.handleLoad22();
    }

    handleLoad22() {
        console.log('handleLoad22 call');
        fetchpipeline2({ projactId: this.projactId })
            .then(result => {
                console.log('resultj ', result);
            })
            .catch(error => {
                this.error = error;
            });
    }

    get firstPipelineName() {
        return this.pipelineList && this.pipelineList.length > 0
            ? this.pipelineList[0].SalesforceOrg__r.Name
            : '';
    }

    get secondPipelineName() {
        return this.pipelineList && this.pipelineList.length > 1
            ? this.pipelineList[1].SalesforceOrg__r.Name
            : '';
    }

    get thirdPipelineName() {
        return this.pipelineList && this.pipelineList.length > 2
            ? this.pipelineList[2].SalesforceOrg__r.Name
            : '';
    }

    get fourPipelineName() {
        return this.pipelineList && this.pipelineList.length > 3
            ? this.pipelineList[3].SalesforceOrg__r.Name
            : '';
    }

    get fivePipelineName() {
        return this.pipelineList && this.pipelineList.length > 4
            ? this.pipelineList[4].SalesforceOrg__r.Name
            : '';
    }
    get sixPipelineName() {
        return this.pipelineList && this.pipelineList.length > 5
            ? this.pipelineList[4].SalesforceOrg__r.Name
            : '';
    }

    handleTypeChange(event) {
        var Picklist_Value = event.target.value;
        this.projactId = Picklist_Value;
        console.log('aaaa', Picklist_Value);
        this.handleLoad();
        // Do Something.
    }

    toggleConfiguration() {
        this.isConfiguring = !this.isConfiguring;

        // Show a message when configuring is toggled
        this.configMessage = this.isConfiguring ? 'Drag and drop strat....' : '';
    }

    drag(event) {
        this.dragSource = event.target;
        console.log('eee', event.target.innerHTML);
        evt.target.classList.add(this.draggingClass);
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('text/html', this.dragSource.innerHTML);
    }

    DragOver(event) {
        // console.log('DragOver', event);
        event.preventDefault();
    }

    Drop(event) {
        if (this.isConfiguring === true) {
            console.log('xxx1');
            event.stopPropagation();
            if (this.dragSource !== event.target) {
                let dragVal = this.dragSource.innerHTML;
                let dropVal = event.target.innerHTML;

                this.dragSource.innerHTML = dropVal;
                event.target.innerHTML = dragVal;
            }
        }
        event.preventDefault();

    }

    newProjectPiplaineCreat() {
        console.log('vvvvz', this.newProjectCreat);
        this.newProjectCreat = !this.newProjectCreat;
        console.log('vvvvsasa', this.newProjectCreat);

    }

    callFromChild(event) {
        console.log('newProjectCreat--->', this.newProjectCreat);
        this.newProjectCreat = event.detail.newProjectCreat;
        console.log('newProjectCreat After--->', this.newProjectCreat);
    }

}