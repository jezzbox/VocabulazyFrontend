import React from "react";
import LoginButton from './LoginButton'
import Button from './Button'

const Welcome = ({ isAuthenticated, userProfile }) => {


    return (
        <section>
          <header>
            <h1>{isAuthenticated && userProfile.displayName ? `Welcome, ${userProfile.displayName}` : "Welcome to Vocabulazy!"}</h1>
          </header>
          {!isAuthenticated && 
          <>
          <div className="center">
            <p>VocabuLazy is a flashcard app for Spanish vocabulary that automatically finds phrases based on the words you choose.</p>
          </div>
          
          <div className="center">
            <LoginButton />
            <Button text="Try it out" />
          </div>
          </>}
        </section>
        );
};

export default Welcome;
