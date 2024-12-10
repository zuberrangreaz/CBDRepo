public class BitbucketCommit {
    public void commitFile(String accessToken, String repoSlug, String filePath, String fileContent, String commitMessage) {
        String commitEndpoint = 'https://api.bitbucket.org/2.0/repositories/{workspace}/{repo_slug}/src';
        commitEndpoint = commitEndpoint.replace('{workspace}', 'your_workspace').replace('{repo_slug}', repoSlug);

        String body = 'message=' + EncodingUtil.urlEncode(commitMessage, 'UTF-8') +
                      '&' + EncodingUtil.urlEncode(filePath, 'UTF-8') + '=' + EncodingUtil.urlEncode(fileContent, 'UTF-8');
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(commitEndpoint);
        req.setMethod('POST');
        req.setHeader('Authorization', 'Bearer ' + accessToken);
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setBody(body);

        Http http = new Http();
        HttpResponse res = http.send(req);
        
        if (res.getStatusCode() != 201) {
            throw new CalloutException('Failed to commit file: ' + res.getBody());
        }
    }
}