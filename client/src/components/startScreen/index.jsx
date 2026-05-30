import { useState } from 'react';
import SignInUpPage from '../signInUpPage';
import { isSignedIn } from '../../services/authService';
import Fight from '../fight';
import FightHistory from '../fightHistory';
import SignOut from '../signOut';

export default function StartScreen() {
    const [loggedIn, setLoggedIn] = useState(isSignedIn());

    if (!loggedIn) {
        return <SignInUpPage setIsLoggedIn={setLoggedIn} />;
    }

    return (
        <>
            <Fight />
            <FightHistory />
            <SignOut isSignedIn={loggedIn} onSignOut={() => setLoggedIn(false)} />
        </>
    );
}
