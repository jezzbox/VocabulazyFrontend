import React from "react";
import LoginButton from './LoginButton'
import Button from './Button'

const Welcome = ({ isAuthenticated, isLoading }) => {

    if (isLoading) {
        return <div>Loading ...</div>;
      }

    return (
        !isAuthenticated && (
            <>
            <div className="center">
              <p>VocabuLazy is a flashcard app for Spanish vocabulary that automatically finds phrases based on the words you choose.</p>
            </div>
            <div className="center">
              <LoginButton />
              <Button text="take a demo" />
            </div>
            </>
        )

    );
};

export default Welcome;