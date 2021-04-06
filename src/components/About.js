import React from 'react'

const About = () => {
    return (
        <article className="flex flex-col items-center">
            <header className="p-2">
                <h1 className="text-2xl font-semibold text-center">About</h1>
            </header>
            <p className="text-xl">Vocabulazy is a flashcard app based on the same spaced repetition algorithm used by <a className="text-blue-400" href="https://apps.ankiweb.net/">Anki</a>, but built specifically for spanish vocabulary and its verb conjugations.<br />
                It is not necessary to have used Anki to use this app, however I reccomend you check it out anyway as it's an extremely powerful program for memorization.</p>

            <section className="my-8">
                <header className="p-2">
                    <h2 className="text-xl font-semibold text-center">How it works</h2>
                </header>
                <p className="text-xl">When creating your deck, you choose from a list of available spanish words as your cards. These cards will then find a spanish phrase based on that word. <br />
                
                If the word is a verb, this could include any conjugation of that verb. If it's an adjective it could contain masculine, femenine or plural versions of that word. <br />
                This allows for your cards to have context and variety without having to do any extra work.</p>

                <p className="text-xl text-left my-6">Phrases are currently taken from popular spanish language series but there are plans to expand this in the future.</p>
            </section>

            <section className="my-8">
                <header className="p-2">
                    <h2 className="text-xl font-semibold text-center">Customization</h2>
                </header>
                <p className="text-xl text-left">You can customize the verb conjugations you would like to see, for example you could alter the settings so you only see phrases using the subjunctive. <br />
                This does, however limit the amount of possible phrases you will see.</p>

                <p className="text-xl my-6">You can also customize settings for the repetition algorithm. It is not reccomended to change these unless you know what you are doing.</p>
            </section>

            <section className="my-8">
                <header className="p-2">
                    <h2 className="text-xl font-semibold text-center">Limitations and Issues</h2>
                </header>
                <ul className="list-disc">
                    <li className="p-2 text-lg">There are no translations of the individual words, only a translation of the phrase you see. This is intentional, words can have many different meanings and only with context can you know what it means. <br />
                    You should also have an idea of the word before you put it in your deck.</li>
                    <li className="p-2 text-lg">It is possible that a word you have chosen does not have a phrase yet. You will still see the card however the phrase will be blank. More phrases will be added in the future to prevent this issue</li>
                    <li className="p-2 text-lg">Some words and conjugations are identical (e.g. 've' can be the imperative tú of the verb 'ir' and also singular yo of 'ver'. The app currently has no way to distinguish these. <br />
                        There are plans to identify these in future updates, however it is good practice to see these to know all of the possible meanings, and use context to identify which word it is.</li>
                    <li className="p-2 text-lg">Some english translations may be off. these come directly from english subtitles and the translations are not always </li>
                </ul>
                
            </section>



            <section className="my-8">
                <header className="p-2">
                    <h2 className="text-xl font-semibold text-center">Your data</h2>
                </header>
                <p className="text-xl text-left">Logins are handled by Auth0 which you can read about <a className="text-blue-400" href="https://auth0.com/security">here</a>. 
                This app does not store any of your personal information and the login is used only to save your deck, cards and settings.</p>
            </section>


        </article>
    )
}

export default About
