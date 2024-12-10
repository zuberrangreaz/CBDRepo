public class BitbucketAuth {
    public String getAccessToken(String clientId, String clientSecret) {
        String tokenEndpoint = 'https://bitbucket.org/site/oauth2/access_token';
        HttpRequest req = new HttpRequest();
        req.setEndpoint(tokenEndpoint);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setBody('grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret);

        Http http = new Http();
        HttpResponse res = http.send(req);
        
        if (res.getStatusCode() == 200) {
            Map<String, Object> authResponse = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            return (String) authResponse.get('access_token');
        } else {
            throw new CalloutException('Failed to get access token: ' + res.getBody());
        }
    }
}