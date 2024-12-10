import { LightningElement, wire, track, api } from 'lwc';
import fetchProject from '@salesforce/apex/GetSalesforeceOrg.fetchProject';
import fetchpipeline2 from '@salesforce/apex/GetSalesforeceOrg.fetchpipeline2';

export default class RoleTypeComp extends LightningElement {

    @track data;
    @track error;
    @track imageURL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBByCzoKIlTG3zvmHHr9v7VIgpnJG8N0tIEiaIatsf7bo3ve2nTgCF5vTCq8oWATYSZQ&usqp=CAU';
    @track imageURL1 = 'https://cdn.iconscout.com/icon/premium/png-512-thumb/merge-44-1181522.png?f=webp&w=256';
    @track isConfiguring = false;
    @track newProjectCreat = false;
    @track Project;
    @track TypeOptions;
    @api pipelineList = [];
    @track namedisplay = true;
    showSpinner = false;
    recoredId;
    @api projactId;
    @track value;

    @wire(fetchProject)
    wiredSalesforceOrg({ error, data }) {
        if (data) {
            try {
                this.Project = data;
                let options = [];
                console.log('data[0].Id', data[0].Id);

                for (var key in data) {
                    options.push({ label: data[key].Name, value: data[key].Id });
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
        console.log('handleLoad22 call');
        fetchpipeline2({ projactId: this.projactId })
            .then(result => {
                this.showSpinner = false;
                console.log('JSON.parse(result) ', JSON.parse(result));
                this.pipelineList = JSON.parse(result);
                console.log('before slice   ---> ', JSON.stringify(this.pipelineList));

                this.pipelineList = this.pipelineList.slice(0, 6);

                const newBox = { isShowButtan: false };

                this.pipelineList = [...this.pipelineList, newBox];

                if (this.pipelineList.length > 1) {

                    this.pipelineList[0].isShowButtan = true;
                }

            })
            .catch(error => {
                this.showSpinner = false;
                this.error = error;
            });
    }

    handleTypeChange(event) {
        var Picklist_Value = event.target.value;
        this.value = event.target.value;
        this.projactId = Picklist_Value;
        this.handleLoad();
    }

    toggleConfiguration() {
        if (this.pipelineList.length > 0) {
            this.isConfiguring = !this.isConfiguring;
        }
    }

    newProjectPiplaineCreat() {
        this.newProjectCreat = !this.newProjectCreat;
    }

    callFromChild(event) {
        this.newProjectCreat = event.detail.newProjectCreat;
    }

    callFromorgPiplaine(event) {
        this.isConfiguring = event.detail.isConfiguring;
    }

}