import React from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin as OAuthGoogleLogin
} from "@react-oauth/google"; // Rename the imported GoogleLogin

const GoogleLoginComponent = () => {
  // Rename the custom component
  return (
    <GoogleOAuthProvider clientId="22739851636-rjglr9b9oj3mh5u4predtop0fc6ego8b.apps.googleusercontent.com">
      <div className="min-h-full flex flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Sign in with Google
        </h2>
        <OAuthGoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent; // Use the new component name
