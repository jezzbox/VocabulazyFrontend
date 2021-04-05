import React from "react";
import LoginButton from './LoginButton'
import { Link } from 'react-router-dom'

const Welcome = () => {


    return (
        <article >
          <header className="flex justify-center p-6">
            <h1 className="text-center text-5xl">Welcome to VocabuLazy!</h1>
          </header>
          <>
          <div className="flex justify-center p-6">
            <p className="text-xl">VocabuLazy is a flashcard app based on Anki specifically for Spanish vocabulary.</p>
          </div>
          
          <div className="flex justify-center">
            <LoginButton className="btn border-2 shadow-md border-terraCotta-500 hover:bg-terraCotta-400 hover:shadow-inner ml-2" />
            <Link className="btn border-2 shadow-md border-terraCotta-500 hover:bg-terraCotta-400 hover:shadow-inner ml-2" to="/About">About</Link>
          </div>
          </>
        </article>
        );
};

export default Welcome;
