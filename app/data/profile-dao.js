/* The ProfileDAO must be constructed with a connected database object */
function ProfileDAO(db) {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ProfileDAO)) {
        console.log("Warning: ProfileDAO constructor called without 'new' operator");
        return new ProfileDAO(db);
    }

    var users = db.collection("users");

    var crypto = require('crypto');

    function encrypt(text){
        // console.log(text)
        var cipher = crypto.createCipher('aes192', 'a password');
        var encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    
    function decrypt(encrypted){

        console.log("decrpting "+ encrypted);
        var decipher = crypto.createDecipher('aes192', 'a password');
        var decrypted = decipher.update(encrypted, 'hex', 'utf8');

        decrypted += decipher.final('utf8');
                console.log("result "+ decrypted);

        return decrypted
    }

    
    /*************** SECURITY ISSUE ****************
     ** Sensitive data should be handled with     **
     ** encyrption. Check out the "crypto" module **
     ***********************************************/

    this.updateUser = function(userId, firstName, lastName, ssn, dob, address, bankAcc, bankRouting, callback) {

        // Create user document
        var user = {};
        if (firstName != "" && typeof firstName != "undefined") {
            console.log("################")
            user.firstName = encrypt(firstName);
            console.log("%%%%%%%%%%%%%%%%")

        }
        if (lastName != "" && typeof lastName != "undefined") {
            console.log("################")
            user.lastName = encrypt(lastName);
            console.log("%%%%%%%%%%%%%%%%")
        }
        if (address != "" && typeof address != "undefined") {
            console.log("################")
            user.address = encrypt(address);
            console.log("%%%%%%%%%%%%%%%%")
        }
        if (bankAcc != "" && typeof bankAcc != "undefined"){
            console.log("################")
            user.bankAcc = encrypt(bankAcc);
            console.log("%%%%%%%%%%%%%%%%")
        }
        if (bankRouting != "" && typeof bankRouting != "undefined"){
            console.log("################")
            user.bankRouting = encrypt(bankRouting);
            console.log("%%%%%%%%%%%%%%%%")
        }
        if (ssn != "" && typeof ssn != "undefined") {
            console.log("################")
            user.ssn = encrypt(ssn);
            console.log("%%%%%%%%%%%%%%%%") //<- what if your server gets hacked?
            //encrypt sensitive fields!
        }
        if (dob != "" && typeof dob != "undefined") {
            console.log("################")
            user.dob = encrypt(dob);
            console.log("%%%%%%%%%%%%%%%%")
        }

        users.update({
                _id: parseInt(userId)
            }, {
                $set: user
            },
            function(err, result) {
                if (!err) {
                    console.log("Updated user profile");
                    return callback(null, user);
                }

                return callback(err, null);
            }
        );
    };

    this.getByUserId = function(userId, callback) {
        users.findOne({
                _id: parseInt(userId)
            },
            function(err, user) {
                if (err) return callback(err, null);

                // Here, we're finding the user with userID and
                // sending it back to the user, so if you encrypted
                // fields when you inserted them, you need to decrypt
                // them before you can use them.
                console.log(user.bankRouting)
                if(user.firstName != "" && typeof user.firstName != "undefined"){
                     console.log("$$$$$$$$$$$$$$$");
                     console.log(user.firstName);
                    user.firstName = decrypt(user.firstName)

                }if(user.lastName != "" && typeof user.lastName != "undefined"){
                    console.log("$$$$$$$$$$$$$$$");
                    console.log(user.lastName);
                    user.lastName = decrypt(user.lastName)

                }if(user.bankRouting != "" && typeof user.bankRouting != "undefined"){
                     console.log("$$$$$$$$$$$$$$$");
                    console.log(user.bankRouting);
                    user.bankRouting = decrypt(user.bankRouting)

                }if(user.bankAcc != "" && typeof user.bankAcc != "undefined"){
                    console.log("$$$$$$$$$$$$$$$");
                    console.log(user.bankAcc);
                    user.bankAcc = decrypt(user.bankAcc)
                    
                }if(user.ssn != "" && typeof user.ssn != "undefined"){
                    console.log("$$$$$$$$$$$$$$$");
                    console.log(user.ssn);
                    user.ssn = decrypt(user.ssn)

                }if(user.dob != "" && typeof user.dob != "undefined"){
                    console.log("$$$$$$$$$$$$$$$");
                    console.log(user.dob);
                    user.dob = decrypt(user.dob)

                }if(user.address != "" && typeof user.address != "undefined"){
                    console.log("$$$$$$$$$$$$$$$");
                    console.log(user.address);
                    user.address = decrypt(user.address)
                }

                callback(null, user);
            }
        );
    };
}

module.exports.ProfileDAO = ProfileDAO;
