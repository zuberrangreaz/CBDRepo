import { LightningElement, api, track } from 'lwc';

export default class CodeCompare extends LightningElement {
    @track leftPanelText = '';
    @track rightPanelText = '';
    @api sourceOrgComponentCode;
    @api targetOrgComponentCode;

    isdiff = false;

    connectedCallback() {
        console.log('Source Org Component Code:', this.sourceOrgComponentCode);
        console.log('Target Org Component Code:', this.targetOrgComponentCode);
    }

    handleLeftPanelInput(event) {
        const enteredText = event.target.innerText;
        this.leftPanelText = enteredText;
    }

    handleRightPanelInput(event) {
        const enteredText = event.target.innerText;
        this.rightPanelText = enteredText;
    }


    compareText() {

        // Get the text from both panels
        const sourceCode = this.leftPanelText || this.sourceOrgComponentCode;
        const targetCode = this.rightPanelText || this.targetOrgComponentCode;

        // Split the text into lines
        const sourceLines = sourceCode.split('\n');
        const targetLines = targetCode.split('\n');

        // Get the containers for the left and right panels
        const leftContainer = this.template.querySelector('[data-id="leftPanel"]');
        const rightContainer = this.template.querySelector('[data-id="rightPanel"]');

        // Clear the innerHTML of both containers
        leftContainer.innerHTML = '';
        rightContainer.innerHTML = '';

        let i = 0, j = 0;

        // Loop through both sets of lines
        while (i < sourceLines.length || j < targetLines.length) {
            const sourceLine = sourceLines[i] || '';
            const targetLine = targetLines[j] || '';

            // Create div elements for each line
            const leftDiv = document.createElement('div');
            const rightDiv = document.createElement('div');

            // Compare the lines and log the comparison
            console.log(`Comparing lines: Source(${i}): "${sourceLine}" with Target(${j}): "${targetLine}"`);

            // Check for differences and handle new lines
            if (sourceLine === '' && targetLine !== '') {
                // Handle case where source line is empty but target line is not
                console.log('if 1');
                leftDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
                leftDiv.appendChild(document.createTextNode(' '));
                rightDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                rightDiv.appendChild(document.createTextNode(targetLine));
                j++;
            } else if (sourceLine !== '' && targetLine === '') {
                // Handle case where target line is empty but source line is not
                console.log('else if 2');
                leftDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
                leftDiv.appendChild(document.createTextNode(sourceLine));
                rightDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                rightDiv.appendChild(document.createTextNode(' '));
                i++;
            } else if (sourceLine !== targetLine) {
                // Handle case where lines are different
                console.log('else if 3aa');
                leftDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
                rightDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                leftDiv.appendChild(document.createTextNode(sourceLine));
                rightDiv.appendChild(document.createTextNode(targetLine));
                i++;
                j++;
            } else {
                // Handle case where lines are the same
                console.log('else 4');
                leftDiv.appendChild(document.createTextNode(sourceLine));
                rightDiv.appendChild(document.createTextNode(targetLine));
                i++;
                j++;
            }

            // Append the created divs to the containers
            leftContainer.appendChild(leftDiv);
            rightContainer.appendChild(rightDiv);
        }
    }

}