public class GetSalesforeceOrg {
    @AuraEnabled (cacheable=true)
    public static List<Project__c> fetchProject() {
        return [SELECT Id, Name From Project__c Where Id  IN (Select Project__c From Project_pipeline__c)]; 
    }
    @AuraEnabled (cacheable=false)
    public static List<Project_pipeline__c> fetchpipeline(String projactId) { 
        List<Project_pipeline__c> ProjectpipelineLis = [SELECT Id, Name, Project__c, Order__c, SalesforceOrg__c, SalesforceOrg__r.Name FROM Project_pipeline__c WHERE Project__c =: projactId];
        return ProjectpipelineLis;
    }

        // Wrapper Class
    public class ProjectPipelineWrapper {
        public Id Id { get; set; }
        public String Name { get; set; }
        public Id ProjectId { get; set; }
        public Decimal  Order { get; set; }
        public Id SalesforceOrgId { get; set; }
        public String SalesforceOrgName { get; set; }

        // Constructor
        public ProjectPipelineWrapper(Project_pipeline__c pipeline) {
            this.Id = pipeline.Id;
            this.Name = pipeline.Name;
            this.ProjectId = pipeline.Project__c;
            this.Order = pipeline.Order__c;
            this.SalesforceOrgId = pipeline.SalesforceOrg__c;
            this.SalesforceOrgName = pipeline.SalesforceOrg__r.Name;
        }
    }

    @AuraEnabled (cacheable=false)
    public static String  fetchpipeline2(String projactId) { 
        List<Project_pipeline__c> ProjectpipelineLis = [SELECT Id, Name, Project__c, Order__c, SalesforceOrg__c, SalesforceOrg__r.Name FROM Project_pipeline__c WHERE Project__c =: projactId ORDER BY Order__c ASC ];
        
        List<ProjectPipelineWrapper> pipelineWrappers = new List<ProjectPipelineWrapper>();
        for(Project_pipeline__c pipeline : ProjectpipelineLis) {
            pipelineWrappers.add(new ProjectPipelineWrapper(pipeline));
        }
        
        return JSON.serialize(pipelineWrappers);
    }

        @AuraEnabled
    public static void deletePipelineRecord(Id recordId) {
        try {
            // Make sure you have the necessary permissions to delete the record
            delete [SELECT Id FROM Project_pipeline__c WHERE Id = :recordId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

            @AuraEnabled
    public static void updateProject(Id recordId, List<Id> salesforceOrgIds, Integer orderNumber) {

        List<Project_pipeline__c> pipelineListAddAll = new List<Project_pipeline__c>();
        try {
            // Query the project
            Project__c project = [SELECT Id, Name FROM Project__c WHERE Id = :recordId];

            // Query the Salesforce Org names
            Map<Id, SalesforceOrg__c> orgMap = new Map<Id, SalesforceOrg__c>(
                [SELECT Id, Name FROM SalesforceOrg__c WHERE Id IN :salesforceOrgIds]
            );

            List<Project_pipeline__c> projectsToInsert = new List<Project_pipeline__c>();

            // Create a project for each Salesforce Org ID
            for (Id orgId : salesforceOrgIds) {
                if (orgMap.containsKey(orgId)) {
                    Project_pipeline__c newProject = new Project_pipeline__c();
                    newProject.Name = project.Name + ' - ' + orgMap.get(orgId).Name;
                    newProject.SalesforceOrg__c = orgId; 
                    newProject.Project__c = project.Id;
                    newProject.Order__c = orderNumber;
                    projectsToInsert.add(newProject);
                    orderNumber++;
                }
            }

            insert projectsToInsert;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

 @AuraEnabled
    public static List<Project_pipeline__c> orderUpdate(String dragId, String dropId, Integer dragOrder, Integer dropOrder) {
        try {     

            Project_pipeline__c dragRecord = [SELECT Id, Order__c FROM Project_pipeline__c WHERE Id = :dragId LIMIT 1];
            Project_pipeline__c dropRecord = [SELECT Id, Order__c FROM Project_pipeline__c WHERE Id = :dropId LIMIT 1];
            
            dragRecord.Order__c = dropOrder;
            dropRecord.Order__c = dragOrder;
                        
            List<Project_pipeline__c> pipelineList = new List<Project_pipeline__c> { dragRecord, dropRecord };

            update pipelineList;

            return pipelineList;
        } catch (Exception e) {
            // Handle any exceptions
            System.debug('Error updating order: ' + e.getMessage());
            throw new AuraHandledException('Failed to update order. Please try again.');
        }
    }
}