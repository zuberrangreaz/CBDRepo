public with sharing class ApexBestPracticeChecker {

    // BestPracticeResult class should be PascalCase
    public class BestPracticeResult {
        @AuraEnabled public String message;
        @AuraEnabled public Boolean isBestPractice;

        // Constructor follows camelCase
        public BestPracticeResult(String message, Boolean isBestPractice) {
            this.message = message;
            this.isBestPractice = isBestPractice;
        }
    }

    // Method to check Apex best practices should be camelCase
    @AuraEnabled(cacheable=false)
    public static List<BestPracticeResult> checkApexBestPractices(String apexCode) {
        List<BestPracticeResult> results = new List<BestPracticeResult>();
        
        // Remove comments first to prevent matching within comments
        // String apexCodeWithoutComments = apexCode.replaceAll('(?s)//.*?$|/\\*.*?\\*/', '');
        // Iterate through each line of code to skip comments
        String apexCodeWithoutComments = '';
        boolean insideMultiLineComment = false;
        for (String line : apexCode.split('\n')) {
            // Handle multi-line comments
            if (line.contains('/*')) {
                insideMultiLineComment = true;
            }
            if (!insideMultiLineComment) {
                // If not inside a multi-line comment, process the line
                apexCodeWithoutComments += line + '\n';
            }
            if (line.contains('*/')) {
                insideMultiLineComment = false;
            }
        }
        
        System.debug('Code without comments: ' + apexCodeWithoutComments);
        
        
        // Now check for SOQL queries inside 'for' loops
        if (Pattern.compile('for\\s*\\([^)]*\\)\\s*\\{[^}]*\\bSELECT\\b').matcher(apexCodeWithoutComments).find()) {
            results.add(new BestPracticeResult('Avoid SOQL queries inside loops. Move SOQL queries outside the loop.', false));
        }
        
        

  /*      // 1. Bulkify Methods - Only check if DML found without List input parameter
        if (Pattern.compile('\\b(insert|update|delete|upsert)\\b').matcher(apexCode).find() && !Pattern.compile('List<').matcher(apexCode).find()) {
            results.add(new BestPracticeResult('Consider bulkifying methods by using List inputs.', false));
        }

        // 2. Avoid DML/SOQL Queries in Loops
        if (Pattern.compile('for\\s*\\([^)]*\\)\\s*\\{[^}]*\\b(insert|update|delete|SELECT)\\b').matcher(apexCode).find()) {
            results.add(new BestPracticeResult('Avoid DML or SOQL queries inside loops.', false));
        }

        // 3. Declare Sharing Model Explicitly
        if (!apexCode.contains('with sharing') && !apexCode.contains('without sharing')) {
            results.add(new BestPracticeResult('Declare sharing model explicitly (with sharing/without sharing).', false));
        }

        // 4. Avoid Dynamic SOQL in Traditional Loops, Use SOQL For Loops
        if (Pattern.compile('for\\s*\\([^)]*SELECT').matcher(apexCode).find() && !apexCode.contains(':')) {
            results.add(new BestPracticeResult('Avoid dynamic SOQL in traditional loops, use SOQL for loops.', false));
        }

        // 5. Avoid Nested Loops to Optimize Performance
        if (Pattern.compile('for\\s*\\([^)]*\\)\\s*\\{[^}]*for\\s*\\(').matcher(apexCode).find()) {
            results.add(new BestPracticeResult('Avoid nested loops to optimize performance.', false));
        }

        // 6. Add System.assert to Test Methods
        if (apexCode.contains('@IsTest') && !apexCode.contains('System.assert')) {
            results.add(new BestPracticeResult('Add System.assert to test multiple scenarios.', false));
        }

        // 7. Avoid Hardcoding IDs (e.g., record types, object names)
        if (Pattern.compile('Id\\s*=\\s*\'\\w+\'').matcher(apexCode).find()) {
            results.add(new BestPracticeResult('Avoid hard-coded IDs.', false));
        }

        // 8. Proper Error Handling (Use try-catch)
        if (!apexCode.contains('try') || !apexCode.contains('catch')) {
            results.add(new BestPracticeResult('Ensure proper error handling with try-catch blocks.', false));
        }

        // 9. Properly Handle Bulk Operations (Handle records in collections)
        if (Pattern.compile('update\\s+[a-zA-Z0-9_]*\\s*;').matcher(apexCode).find() && !apexCode.contains('List<')) {
            results.add(new BestPracticeResult('Handle bulk operations with collections (List, Set, Map).', false));
        }
        // 10. Avoid SOQL in Loops - Check for any loops with SOQL inside
        if (Pattern.compile('for\\s*\\([^)]*\\)\\s*\\{[^}]*\\bSELECT\\b').matcher(apexCode).find()) {
            results.add(new BestPracticeResult('Avoid SOQL queries inside loops. Move SOQL queries outside the loop.', false));
        }

       // 11. Avoid DML Statements in Loops
        if (Pattern.compile('for\\s*\\([^)]*\\)\\s*\\{[^}]*\\b(insert|update|delete)\\b').matcher(apexCode).find()) {
            results.add(new BestPracticeResult('Avoid DML statements inside loops. Move DML operations outside loops.', false));
        }

        // 12. Follow Naming Conventions (CamelCase for methods/variables, PascalCase for classes)
               // It should start with an uppercase letter and follow with any combination of letters or numbers.
        if (Pattern.compile('\\b[A-Z][a-zA-Z0-9]*\\b').matcher(apexCode).find() && !Pattern.compile('void\\s+[a-z]').matcher(apexCode).find()) {
            results.add(new BestPracticeResult('Follow proper naming conventions (PascalCase for classes).', false));
        }

        // camelCase check for Methods and Variables
        if (Pattern.compile('\\b[a-z][a-zA-Z0-9]*\\b').matcher(apexCode).find() && !Pattern.compile('\\b[A-Z][a-zA-Z0-9]*\\b').matcher(apexCode).find()) {
            results.add(new BestPracticeResult('Follow proper naming conventions (camelCase for methods/variables).', false));
        }*/
        return results;
    }
}