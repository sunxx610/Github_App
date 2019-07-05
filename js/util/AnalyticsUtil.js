//aws analytics
import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import awsconfig from '../aws-exports';

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
// send analytics events to Amazon Pinpoint
Analytics.configure(awsconfig);

export {Auth, Analytics,awsconfig}