import React from "react";
import LoginButton from './LoginButton'
import Button from './Button'

const Welcome = ({ isAuthenticated }) => {


    return (
        !isAuthenticated && (
        <section>
          <header>
            <h1>Welcome to Vocabulazy!</h1>
          </header>
          <div className="center">
            <p>VocabuLazy is a flashcard app for Spanish vocabulary that automatically finds phrases based on the words you choose.</p>
          </div>
          <div className="center">
            <LoginButton />
            <Button text="Try it out" />
          </div>
        </section>
        )

    );
};

export default Welcome;
