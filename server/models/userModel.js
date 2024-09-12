
import mongoose from "mongoose";
import populate from "mongoose-autopopulate";
import bcrypt from 'bcryptjs';

const userModel = new mongoose.Schema( {

    // User's Username, used for refs and authentication. 
    name: {
        type: String,
        required: true,
        unique: true,
    },

    // User's displayed name, clientside facing.
    display_name: {
        type: String,
        // required: true,
        default: '',
        unique: false,
    },

    password: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    avatar: {
        // Avatar image, shown next to anywhere their name appears. 
        type: String,
        default: "https://i.pravatar.cc/150?img=50"
    },

    banner: {
        // Banner image on profile. Goes behind avatar. 
        type: String,
        default: ""
    },

    // Permissions system, to be added later. 
    role: {
        type: String,
        required: true,
        enum: [ "deleted", "guest", "admin" ],
        default: "guest",
    },

    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ],

    status: {
        type: String,
        default: '',
    },

    about: {
        type: String,
        default: '',
    },

    /// REQUIRED BUT GENERATED
    token: {
        type: String,
    },

    /// OPTIONAL / SUPPLEMENTAL
    register_date: {
        type: Date,
        default: Date.now,
    },

    last_login: {
        type: Date,
        default: Date.now,
    }

    // Make this a settings object later. 
    // settings: {
    //     type: {
    //         
    //     },
    //     required: false,
    //     default: {}
    // }
}, {
    // This adds "createdAt" and "updatedAt" timestamps automatically.
    timestamps: true,
    _id: true,
    // plugin: populate
} );
userModel.plugin( populate );

userModel.methods.matchPassword = async function ( enteredPassword ) {
    return await bcrypt.compare(
        enteredPassword,
        this.password
    );
}

// Before saving, encrypt password.
userModel.pre( 'save', async function ( next ) {
    if ( !this.isModified ) {
        next();
    }

    const salt = await bcrypt.genSalt( 10 );
    this.password = await bcrypt.hash( this.password, salt );
} );

const User = mongoose.model( "users", userModel );

export default User;
