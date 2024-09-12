import * as util from 'akashatools';


export const uploadImage = ( avatar ) => {
    // Upload temp picture to cloudinary
    if ( avatar === undefined ) {
        return {
            success: false,
            message: "Please select a file."
        };
    }

    console.log( "uploadImage", " :: ", "input avatar = ", avatar );

    if ( avatar.type === "image/jpeg" || avatar.type === "image/png" ) {
        const cloudName = 'dcbbqg2vp';
        const url = `https://api.cloudinary.com/v1_1/${ cloudName }/upload`;
        const data = new FormData();
        data.append( "file", avatar );
        data.append( "upload_preset", "gridchat" );
        data.append( "cloud_name", cloudName );

        // try {
        //     const res = await fetch(
        //         url, {
        //         method: 'post',
        //         // headers: {
        //         //     "Content-Type": "application/json"
        //         // },
        //         body: data,
        //     } );
        //     if ( !res.ok ) {
        //         console.log( "Res.ok is false. Status: ", res.status );
        //     }
        //     const json = await res.json();
        //     console.log( "uploadImage :: data = ", json );
        //     return {
        //         success: true,
        //         data: json.url.toString(),
        //         message: 'Image uploaded successfully.'
        //     }
        // } catch ( error ) {
        //     console.log( "uploadImage", " :: ", "ERROR: error = ", error );
        //     return {
        //         success: false,
        //         message: error
        //     };
        // }

        fetch( url, {
            method: "post",
            body: data,
        } )
            .then( ( res ) => { res.json(); } )
            .then( ( data ) => {
                // Success, return the image URL. 
                console.log( "uploadImage", " :: ", "data = ", data );
                return {
                    success: true,
                    data: data.url.toString(),
                    message: 'Image uploaded successfully.'
                }
            } )
            .catch( ( err ) => {
                console.log( "uploadImage", " :: ", "ERROR: err = ", err );
                return {
                    success: false,
                    message: err
                };
            } );
    } else {
        return {
            success: false,
            message: "Please select an image file type."
        };
    }
}

export function sRandom ( length ) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Loop to generate characters for the specified length
    for ( let i = 0; i < length; i++ ) {
        const randomInd = Math.floor( Math.random() * characters.length );
        result += characters.charAt( randomInd );
    }
    return result;
}
