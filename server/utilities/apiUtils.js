
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// OBJECT & OBJECT-ARRAY MANIPULATION
// This applies the properties of spliceObj to each object in the objArray.
export const SpliceObjArray = ( objArray, spliceObj ) => {
    if ( Array.isArray( objArray ) ) {
        return objArray.map( ( obj ) => {
            return Object.assign( obj, spliceObj );
        } );
    } else {
        // * console.log("OBJUTILS.JS :: SpliceObjArray :: objArray = ", objArray, "\nspliceObj = ", spliceObj, "\nError: Bad input.");
        return objArray;
    }
};

export const mergeProps = ( src, tgt ) => {
    // Accepts two objects; src is the object being edited, inputs is the object containing only the properties that are being updated.
    if ( Object.keys( src ).length ) {
        if ( src._doc && Object.keys( tgt ).length ) {
            let merged = {}; // = src;
            Object.keys( src._doc ).forEach( ( key, index ) => {
                let tgtValue = tgt[ key ];
                let srcValue = src[ key ];

                if ( tgt[ key ] ) {
                    // Input has this property.
                    merged = { ...merged, [ key ]: tgtValue };
                } else {
                    merged = { ...merged, [ key ]: srcValue };
                }
            } );
            return merged;
        } else {
            return src;
        }
    } else {
        return src;
    }
}

export const swapIfValid = ( src, tgt ) => {
    if ( tgt !== null && tgt !== undefined ) {
        if ( tgt !== "" ) {
            if ( src !== tgt ) {
                return tgt;
            }
        }
    }
    return src;
}

const formatProfile = ( user, isLoggedUser = false ) => {
    if ( isLoggedUser ) {
        // If requesting user is logged in user, then send full details.
        return {
            _id: user._id,
            name: user.name,
            display_name: user.display_name,
            email: user.email,
            avatar: user.avatar,
            banner: user.banner,
            role: user.role,
            status: user.status,
            about: user.about,
            friends: user.friends,
            last_login: user.last_login,
            register_date: user.register_date,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: user.token,
        };
    }
    else {
        // Else, send only basic details for viewing purposes. 
        return {
            _id: user._id,
            name: user.name,
            display_name: user.display_name,
            email: user.email,
            avatar: user.avatar,
            banner: user.banner,
            role: user.role,
            status: user.status,
            about: user.about,
            // friends: user.friends,
            // last_login: user.last_login,
            register_date: user.register_date,
            createdAt: user.createdAt,
            // updatedAt: user.updatedAt,
            token: user.token,
        };
    }

}
