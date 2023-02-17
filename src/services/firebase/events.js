import {auth} from './setup';

export const userChange = (callback) => {
    auth.onAuthStateChanged((user) => {
        if(user && !user.isAnonymous){
            callback({
                id:user.uid,
                correo: user.email,
                nombre: user.displayName,
                image: user.photoURL,
            });
        }
    });
}

