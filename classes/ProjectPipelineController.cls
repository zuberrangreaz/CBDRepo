public with sharing class ProjectPipelineController {
    @AuraEnabled
    public static String createProjectPipeline(String projectName, List<Id> salesforceOrgIds, string ProjectId) {
        try {
            List<Project_pipeline__c> projectsToInsert = new List<Project_pipeline__c>();
            
            // Create a project for each Salesforce Org ID
            for (Id orgId : salesforceOrgIds) {
                Project_pipeline__c newProject = new Project_pipeline__c();
                newProject.Name = projectName; // Common project name
                newProject.SalesforceOrg__c = orgId; // Link to Salesforce Org
                newProject.Project__c = ProjectId;
                projectsToInsert.add(newProject); // Add to the list
            }

            // Insert all projects at once for efficiency
            insert projectsToInsert;

            return 'Projects created successfully'; // Return success message
        } catch (Exception e) {
            throw new AuraHandledException('Error creating projects: ' + e.getMessage());
        }
    }
}